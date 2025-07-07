import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { UserfromServerType } from "../lib/zodschemas/zodSchemas";
// Define the structure for the login result
interface loginResult {
    status: boolean;
    code: string;
    message: string
  }
type AuthContextType = {
    loader: boolean;
    setLoader: React.Dispatch<React.SetStateAction<boolean>>;
    user: UserfromServerType | null;
    setUser: React.Dispatch<React.SetStateAction<UserfromServerType | null>>;
    login: (email: string, password: string) => Promise<loginResult>;
    register: (user: UserfromServerType) => Promise<boolean>;
    logout: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
    loader: false,
    setLoader: () => {},
    user: null,
    setUser: () => {},
    login: () => Promise.resolve({ status: false, code: "", message: 'Default error' }),
    register: () => Promise.resolve(false),
    logout: () => Promise.resolve(false),
});

interface AuthContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [loader, setLoader] = useState<boolean>(false)
    const [user, setUser] = useState<UserfromServerType | null>(null);


const login = async (email: string, password: string): Promise<loginResult> => {
  try {
    const res = await auth().signInWithEmailAndPassword(email, password);
    const uid = res.user?.uid;

    if (uid) {
      const userDoc = await firestore().collection('users').doc(uid).get();

      if (userDoc.exists) {
        setUser(userDoc.data() as UserfromServerType);
        return { status: true, code: "", message: "Login Successful!" };
      } else {
        return { status: false, code: "user/not-found", message: "User data not found!" };
      }
    } else {
      return { status: false, code: "auth/uid-missing", message: "UID not found!" };
    }

  } catch (e: unknown) {
    // Safely extract error message and code
    if (e && typeof e === 'object' && 'code' in e && 'message' in e) {
      const err = e as { code: string; message: string };
      console.log(err.code);
      return { status: false, code: err.code, message: err.message };
    }

    // Fallback for completely unknown errors
    return { status: false, code: "unknown", message: "An unexpected error occurred." };
  }
};





    const register = async (data: UserfromServerType): Promise<boolean> => {
        try {
            const res = await auth().createUserWithEmailAndPassword(data.email, data.password);
            const uid = res.user?.uid;
            if (uid) {
                // Save user data to Firestore
                const res = await firestore().collection('users').doc(uid).set({ ...data, uid });
                // Fetch the user data from Firestore after login
                const userDoc = await firestore().collection('users').doc(uid).get();
                if (userDoc.exists) {
                    setUser(userDoc.data() as UserfromServerType);
                }
                return true; // Return true on successful registration
            } else {
                console.error("User ID not found");
                return false; // Return false if UID is not found
            }
        } catch (e) {
            console.error(e);
            return false; // Return false on error
        }
    };






    const logout = async () => {
        try {
            await auth().signOut();
            setUser(null); // Clear user state on logout
            return true;
        } catch (e) {
            console.error(e);
            return true;
        }
    };

    return (
        <AuthContext.Provider value={{ loader, setLoader, user, setUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContexts = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContexts must be used within an AuthContextProvider");
    }
    return context;
};

export default AuthContextProvider;
