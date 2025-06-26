import AsyncStorage from '@react-native-async-storage/async-storage';

//Reading Data
export const getData = async (key:string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value !== null ? value : null;
    } catch (e) {
      return e;
    }
  };

export  const getJsonDatafromAsyncStorage = async (key:string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const jsonData =  jsonValue != null ? JSON.parse(jsonValue) : null;
      return jsonData;
    } catch (e) {
      return e;
    }
  };


//Storing Data
export const storeSingleDataToAsyncStorage = async (key:string, value:string | number | boolean ) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (e) {
        return e;
    }
  };

export const storeObjDataToAsyncStorage = async (key:string, value:Object)=>{
          try {
            const jsonData = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonData)
          } catch (e){
            console.log(e)      
          }
        };

  //merge data or merge data
  export const mergeData = async (objKey:string,  obj:object) => {
    try {
      await AsyncStorage.mergeItem(objKey, JSON.stringify(obj))
      const jsonValue = await AsyncStorage.getItem(objKey)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    }catch(e){
        return e;
    }
  }

  //Delete Data
  export const deleteDataFromAsyncStorage = async (key:string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
      return e;
    }
  };

// Function to retrieve and log all keys and values
export const logAllKeysAndValues = async () => {
  try {
    // Get all keys
    const keys = await AsyncStorage.getAllKeys();
    
    // Get the corresponding values for each key
    const result = await AsyncStorage.multiGet(keys);
    
    // Log each key-value pair
    result.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  } catch (error) {
    console.error('Error fetching AsyncStorage data', error);
  }
};



