import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainAppStack from '../routes/MainAppHome/MainAppStack';
import AuthenticationRoute from './Authentication/AuthenticationRoute';
import auth,  { User } from '@react-native-firebase/auth';
import firestore, { DocumentSnapshot } from '@react-native-firebase/firestore';
import { useAuthContexts } from '../contexts/AuthContext';

// Define the type for user data from Firestore
interface UserData {
    branch: string;
    contact: number;
    email: string;
    id: string;
    imageId: string;
    role: string;
    teaClass: string;
    userName: string;
}

const Main: React.FC = () => {
    const [initializing, setInitializing] = useState(true);
    const { user, setUser } = useAuthContexts();

    // Handle user state changes
    const stateChanged = async (currentUser: User | null) => {
        if (currentUser) {
            // Fetch user data from Firestore
            const userDoc: DocumentSnapshot<UserData> = await firestore()
                .collection('users')
                .doc(currentUser.uid)
                .get();

            if (userDoc.exists) {
                setUser(userDoc.data() as UserData); // Cast to UserData type
            } else {
                setUser(null); // Handle case where user document doesn't exist
            }
        } else {
            setUser(null); // User is signed out
        }
        
        if (initializing) setInitializing(false); // Set initializing to false after user state is determined
    };
  
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(stateChanged);
        return () => subscriber(); // Unsubscribe on unmount
    }, []);

    if (initializing) return null; // Show a loading screen or nothing while initializing


    return (
        <NavigationContainer>
            {user ? <MainAppStack /> : <AuthenticationRoute />} 
        </NavigationContainer>
    );
};

export default Main;
