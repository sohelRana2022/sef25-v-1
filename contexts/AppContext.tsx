import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextProps {
    loader: boolean;
    setLoader: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface HomeScreenProps {
    navigation: () => void;
}

interface AppContextProviderProps {
    children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {

    const [loader, setLoader] = useState(false);

    return (
        <AppContext.Provider
            value={{ loader, setLoader}}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContexts = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContexts must be used within an AppContextProvider");
    }
    return context;
};

export default AppContextProvider;
