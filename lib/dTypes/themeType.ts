import { MD3Theme } from 'react-native-paper';

export interface CustomTheme extends MD3Theme {
  customProperties: {
    user: object;
    setUser: React.Dispatch<React.SetStateAction<object>>;
  };
}
