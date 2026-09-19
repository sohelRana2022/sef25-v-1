import React from 'react';
import LottieView from 'lottie-react-native';

export default function SuccessAnimation() {
  return (
    <LottieView
      source={require('../../lib/lottie_animations/success.json')}
      autoPlay
      loop
      style={{width: 100, height: 100}}
    />
  );
}
