import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

import {useAuthContexts} from '../../contexts/AuthContext';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface AddAdressProps {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
}

type AddressType = {
  id: number;
  sef_branch: string;
  value: string;
  label: string;
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const AddAdress: React.FC<AddAdressProps> = () => {
  const {user} = useAuthContexts();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [address, setAddress] = useState<AddressType[]>([]);
  const [searchText, setSearchText] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  /* ------------------------------------------------------------------------ */
  /* Bangla Validation                                                        */
  /* ------------------------------------------------------------------------ */

  const isBanglaText = (text: string): boolean => {
    const value = text.trim();

    if (!value) {
      return false;
    }

    /*
     * বাংলা Unicode range:
     * U+0980 - U+09FF
     *
     * Space এবং Bengali punctuation allow করা হয়েছে।
     */
    const banglaRegex = /^[\u0980-\u09FF\s।,;:'"!?()-]+$/;

    return banglaRegex.test(value);
  };

  /* ------------------------------------------------------------------------ */
  /* Get Address                                                              */
  /* ------------------------------------------------------------------------ */

  const addressAll = useCallback(async () => {
    if (!user?.branch) {
      setAddress([]);
      return;
    }

    try {
      setLoading(true);

      const snapshot = await firestore()
        .collection('address')
        .where('sef_branch', '==', user.branch)
        .get();

      const addressData: AddressType[] = snapshot.docs.map(doc => {
        const data = doc.data();

        return {
          id: Number(data.id) || 0,
          sef_branch: String(data.sef_branch ?? ''),
          value: String(data.value ?? ''),
          label: String(data.label ?? ''),
        };
      });

      setAddress(addressData);
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress([]);
    } finally {
      setLoading(false);
    }
  }, [user?.branch]);

  /* ------------------------------------------------------------------------ */
  /* Load Address                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    addressAll();
  }, [addressAll]);

  /* ------------------------------------------------------------------------ */
  /* Search                                                                   */
  /* ------------------------------------------------------------------------ */

  const filteredAddress = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    if (!search) {
      return address;
    }

    return address.filter(item => {
      return (
        item.label.toLowerCase().includes(search) ||
        item.value.toLowerCase().includes(search)
      );
    });
  }, [address, searchText]);

  const searchNotFound =
    searchText.trim().length > 0 && filteredAddress.length === 0;

  /* ------------------------------------------------------------------------ */
  /* Search Input                                                             */
  /* ------------------------------------------------------------------------ */

  const handleSearchChange = (text: string) => {
    setErrorMessage('');

    /*
     * Search-এর ক্ষেত্রেও শুধু বাংলা character allow করছি।
     */

    if (text === '') {
      setSearchText('');
      return;
    }

    const banglaRegex = /^[\u0980-\u09FF\s।,;:'"!?()-]+$/;

    if (banglaRegex.test(text)) {
      setSearchText(text);
    } else {
      setErrorMessage('বাংলায় লিখুন।');
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Open Add Modal                                                           */
  /* ------------------------------------------------------------------------ */

  const handleOpenAddModal = () => {
    if (!isBanglaText(searchText)) {
      setErrorMessage('শুধুমাত্র বাংলা অক্ষরে ঠিকানা লিখুন।');
      return;
    }

    setNewAddress(searchText.trim());
    setErrorMessage('');
    setModalVisible(true);
  };

  /* ------------------------------------------------------------------------ */
  /* New Address Input                                                        */
  /* ------------------------------------------------------------------------ */

  const handleNewAddressChange = (text: string) => {
    setErrorMessage('');

    if (text === '') {
      setNewAddress('');
      return;
    }

    const banglaRegex = /^[\u0980-\u09FF\s।,;:'"!?()-]+$/;

    if (banglaRegex.test(text)) {
      setNewAddress(text);
    } else {
      setErrorMessage('শুধুমাত্র বাংলা অক্ষর ব্যবহার করুন।');
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Add Address                                                              */
  /* ------------------------------------------------------------------------ */

  const handleAddAddress = async () => {
    const value = newAddress.trim();

    if (!value) {
      setErrorMessage('ঠিকানা লিখুন।');
      return;
    }

    if (!isBanglaText(value)) {
      setErrorMessage('শুধুমাত্র বাংলা অক্ষরে ঠিকানা লিখুন।');
      return;
    }

    if (!user?.branch) {
      setErrorMessage('ব্যবহারকারীর branch পাওয়া যায়নি।');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');

      const addressCollection = firestore().collection('address');

      /* ------------------------------------------------------------------ */
      /* Duplicate Check                                                    */
      /* ------------------------------------------------------------------ */

      const duplicateSnapshot = await addressCollection
        .where('branch', '==', user.branch)
        .where('label', '==', value)
        .limit(1)
        .get();

      if (!duplicateSnapshot.empty) {
        setErrorMessage('এই ঠিকানাটি ইতোমধ্যে আছে।');
        return;
      }

      /* ------------------------------------------------------------------ */
      /* Generate Next ID                                                   */
      /* ------------------------------------------------------------------ */

      await firestore().runTransaction(async transaction => {
        const lastAddressSnapshot = await addressCollection
          .orderBy('id', 'desc')
          .limit(1)
          .get();

        let lastId = 0;

        if (!lastAddressSnapshot.empty) {
          const lastData = lastAddressSnapshot.docs[0].data();

          lastId = Number(lastData.id) || 0;
        }

        const newId = lastId + 1;

        const newAddressRef = addressCollection.doc(String(newId));

        transaction.set(newAddressRef, {
          id: newId,

          // আপনার actual structure অনুযায়ী
          sef_branch: user.branch,

          // আপাতত value এবং label একই রাখা হয়েছে
          value: value,
          label: value,
        });
      });

      /* ------------------------------------------------------------------ */
      /* Success                                                            */
      /* ------------------------------------------------------------------ */

      setModalVisible(false);
      setNewAddress('');
      setSearchText('');

      await addressAll();
    } catch (error) {
      console.error('Error adding address:', error);
      setErrorMessage('ঠিকানা সংরক্ষণ করা যায়নি।');
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Address List                                                             */
  /* ------------------------------------------------------------------------ */

  const addressList: ListRenderItem<AddressType> = ({item, index}) => {
    return (
      <View className="flex-row items-center border-b border-gray-200 py-3 px-2">
        <Text className="w-10 text-black font-HindRegular">{index + 1}</Text>

        <View className="flex-1">
          <Text className="text-black font-HindSemiBold">{item.label}</Text>

          {item.value !== item.label && (
            <Text className="text-gray-500 font-HindRegular">{item.value}</Text>
          )}
        </View>
      </View>
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <View className="flex-1 bg-white px-10">
      {/* ------------------------------------------------------------------ */}
      {/* Search                                                             */}
      {/* ------------------------------------------------------------------ */}

      <TextInput
        value={searchText}
        onChangeText={handleSearchChange}
        placeholder="ঠিকানা খুঁজুন..."
        placeholderTextColor="#999"
        style={{
          backgroundColor: '#FFF',
          fontFamily: 'HindSiliguri-SemiBold',
          marginVertical: 20,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          paddingHorizontal: 15,
          height: 50,
          color: '#222',
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* List                                                               */}
      {/* ------------------------------------------------------------------ */}

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredAddress}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={addressList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-10">
              <Text className="text-gray-500 font-HindRegular">
                {searchText.trim()
                  ? 'কোনো ঠিকানা পাওয়া যায়নি'
                  : 'কোনো ঠিকানা নেই'}
              </Text>
            </View>
          }
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Error Message                                                      */}
      {/* ------------------------------------------------------------------ */}

      {errorMessage !== '' && (
        <View className="absolute left-10 right-10 bottom-28 bg-red-50 rounded-lg p-3">
          <Text className="text-red-600 text-center font-HindRegular">
            {errorMessage}
          </Text>
        </View>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Plus Button                                                        */}
      {/* ------------------------------------------------------------------ */}

      <View className="absolute bottom-10 right-10">
        <TouchableOpacity
          disabled={!searchNotFound || saving}
          onPress={handleOpenAddModal}
          className={`w-16 h-16 rounded-full justify-center items-center ${
            searchNotFound ? 'bg-[#FBB03B]' : 'bg-gray-300'
          }`}>
          <Text className="text-white text-4xl font-light">+</Text>
        </TouchableOpacity>
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* Add Address Modal                                                  */}
      {/* ------------------------------------------------------------------ */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!saving) {
            setModalVisible(false);
          }
        }}>
        <View className="flex-1 justify-center items-center bg-black/50 px-8">
          <View className="w-full bg-white rounded-2xl p-6">
            <Text className="text-xl text-black font-HindSemiBold mb-5">
              নতুন ঠিকানা যোগ করুন
            </Text>

            <TextInput
              value={newAddress}
              onChangeText={handleNewAddressChange}
              placeholder="ঠিকানা লিখুন..."
              placeholderTextColor="#999"
              autoFocus
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                paddingHorizontal: 15,
                height: 50,
                color: '#222',
                fontFamily: 'HindSiliguri-SemiBold',
              }}
            />

            {errorMessage !== '' && (
              <Text className="text-red-500 mt-2 font-HindRegular">
                {errorMessage}
              </Text>
            )}

            <View className="flex-row justify-end mt-6">
              <TouchableOpacity
                disabled={saving}
                onPress={() => {
                  setModalVisible(false);
                  setNewAddress('');
                  setErrorMessage('');
                }}
                className="px-5 py-3 mr-2">
                <Text className="text-gray-500 font-HindSemiBold">বাতিল</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={saving || !newAddress.trim()}
                onPress={handleAddAddress}
                className="bg-[#0B2447] rounded-lg px-6 py-3">
                {saving ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text className="text-white font-HindSemiBold">সংরক্ষণ</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddAdress;
