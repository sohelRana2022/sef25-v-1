import axios from "axios";
import { storeObjDataToAsyncStorage } from "../helpers/localStorageFuncs";



const getAllDataAndSetToLocalStorage = async (key:string, api:string) => {
    try {
      const res = await axios.get(api);
      if (res.data) {
        storeObjDataToAsyncStorage(key,res.data.response)
      } else {
        return res.status;
      }
    } catch (err) {
      console.log('Network Problem!');
    }
  };
