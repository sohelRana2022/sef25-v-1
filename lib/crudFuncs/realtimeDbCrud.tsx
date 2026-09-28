import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

export type AddressType = {
  id: string;
  label: string;
  value: string;
  branch: string;
};

export type sliderType = {
  id: string;
  sliderName: string;
  sliderId: string;
  branch: string;
};

export const getAllAddresses = async (): Promise<AddressType[]> => {
  try {
    const snapshot = await database().ref('/address').once('value');

    const data = snapshot.val();

    if (!data) {
      return [];
    }

    return Object.entries(data).map(([key, value]) => ({
      id: key,
      ...(value as Omit<AddressType, 'id'>),
    }));
  } catch (error) {
    console.error('Error reading addresses:', error);
    return [];
  }
};

// To get sliders from the database
export const getSliders = async (branch: string): Promise<sliderType[]> => {
  try {
    const snapshot = await database()
      .ref('/sliders')
      .orderByChild('branch')
      .equalTo(branch)
      .once('value');

    const data = snapshot.val();

    if (!data) {
      return [];
    }

    return Object.entries(data)
      .filter(([_, value]) => value != null)
      .map(([key, value]) => ({
        id: key,
        ...(value as Omit<sliderType, 'id'>),
      }));
  } catch (error) {
    console.error('Error reading sliders:', error);
    return [];
  }
};
