import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import firestore from '@react-native-firebase/firestore';
import {
    PersonalInfoType, 
    PersonalInfoSchemama, 
    ParentsAndContactInfoType, 
    ParentsAndContactInfoSchemama, 
    extraDataSchema, 
    AdmissionDataType, 
    AdmissionDataSchema,
    extraDataType
    } from "../lib/zodschemas/zodSchemas";
import { calculateValidDays } from "../lib/helpers/helpers";


type AdmissionContextType = {
    loader: boolean;
    extraData: extraDataType | null;
    personalInfo: PersonalInfoType | null;
    parentsAndContactInfo: ParentsAndContactInfoType | null;
    setLoader: React.Dispatch<React.SetStateAction<boolean>>;
    setExtraData: React.Dispatch<React.SetStateAction<extraDataType | null>>;
    setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInfoType | null>>;
    setParentsAndContactInfo: React.Dispatch<React.SetStateAction<ParentsAndContactInfoType | null>>;
    onSubmitAll: (extraDta:extraDataType)=>Promise<{status:boolean, message:string}>;
    resetForm: () => void; // ⬅️ Add this
}

const AdmissionContext = createContext<AdmissionContextType>({
    loader: false,
    personalInfo: null,
    parentsAndContactInfo: null,
    extraData: null,
    setLoader: ()=>{},
    setExtraData: ()=>{},
    setPersonalInfo: () => { },
    setParentsAndContactInfo: () => { },
    onSubmitAll: () => Promise.resolve({ status: false, message: 'Not initialized' }),
    resetForm: () => {}, // ⬅️ Add this default
});

interface AdmissionContextProviderProps {
    children: ReactNode;
}

const AdmissionContextProvider: React.FC<AdmissionContextProviderProps> = ({ children }) => {
    const [loader, setLoader] = useState<boolean>(false);
    const [extraData, setExtraData] = useState<extraDataType | null>(null);
    const [personalInfo, setPersonalInfo] = useState<PersonalInfoType | null>(null);
    const [parentsAndContactInfo, setParentsAndContactInfo] = useState<ParentsAndContactInfoType | null>(null);
    
    const resetForm = () => {
            setExtraData(null);
            setPersonalInfo(null);
            setParentsAndContactInfo(null);
            };


    const onSubmitAll = async (extraDta:extraDataType)=>{
        
        const timestamp = new Date();
        setExtraData(extraDta);
        const allAdmissionData: AdmissionDataType = {
            ...(personalInfo as PersonalInfoType),
            ...(parentsAndContactInfo as ParentsAndContactInfoType),
            ...extraDta
        }
                
        const docRef = firestore().collection('newinfos').doc(); // generate document reference with ID
        await docRef.set({ ...allAdmissionData, valid_days: calculateValidDays(timestamp), send_date: timestamp, is_admitted: false, is_active: true });
        if(docRef.id){
            return {status: true, message: 'অভিনন্দন! আপনার তথ্য জমা হয়েছে ।'}; // Return true on successful registration
        }else{
            return {status: false, message: 'Ops! Data not sent!'};
        }
    }

    return (
        <AdmissionContext.Provider
            value={{loader, setLoader, resetForm, extraData, setExtraData, personalInfo,  setPersonalInfo, parentsAndContactInfo,  setParentsAndContactInfo, onSubmitAll }}
        >
            {children}
        </AdmissionContext.Provider>
    );
};

export const useAdmissionContexts = () => {
    const context = useContext(AdmissionContext);
    if (!context) {
        throw new Error("useAdmissionContexts must be used within an AdmissionContextProvider");
    }
    return context;
};

export default AdmissionContextProvider;
