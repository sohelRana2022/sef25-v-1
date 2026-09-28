import React from 'react';
import LottieView from 'lottie-react-native';

export default function PhoneTapping() {
  return (
    <LottieView
      source={require('../../lib/lottie_animations/phonetapping.json')}
      autoPlay
      loop
      style={{width: 300, height: 300}}
    />
  );
}
