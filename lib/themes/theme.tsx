
import { configureFonts, MD2LightTheme,  DefaultTheme } from 'react-native-paper';
const fontConfig = {
  android: {
    regular: {
      fontFamily: 'HindSiliguri-SemiBold',
    },
    medium: {
      fontFamily: 'HindSiliguri-SemiBold',
    },
    light: {
      fontFamily: 'HindSiliguri-Light',
    },
    thin: {
      fontFamily: 'HindSiliguri-Regular',
    },
  }
} as const;

export const theme = {
    ...MD2LightTheme,
    roundness:5,
    fonts: configureFonts({config: fontConfig, isV3: false}),
    colors: {
      ...MD2LightTheme.colors,
      primary: '#0B2447',
      secondary: '#0B2447',
      statusBarColor: '#0B2447'
    }
}