import * as React from 'react';
import { Text, StyleSheet, Dimensions, Animated } from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';

interface ErrMsgProps {
  errText: string;
  duration?: number;      // fade-in animation duration
  hideAfter?: number;     // auto-hide after how many ms
  fontFamily?: string;
}

const ErrMsg = ({ errText, duration = 200, hideAfter = 2000, fontFamily }: ErrMsgProps) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();

    // Auto hide after hideAfter ms
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false); // finally hide the component completely
      });
    }, hideAfter);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Icons style={styles.iconStyle} name="warning" />
      <Text style={[styles.errorTxt, { fontFamily }]}>{errText}</Text>
    </Animated.View>
  );
};

export default ErrMsg;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: 'rgba(251,200,0,0.5)',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  errorTxt: {
    width: '85%',
    textAlign: 'left',
    color: 'rgba(255,0,0,0.5)',
    fontSize: 16,
  },
  iconStyle: {
    width: '15%',
    fontSize: 25,
    color: 'rgba(255,0,0,0.5)',
  },
});
