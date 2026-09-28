import React from 'react';
import LottieView from 'lottie-react-native';

export default function SuccessAnime() {
  return (
    <LottieView
      source={require('../../lib/lottie_animations/success')}
      autoPlay
      loop
      style={{width: 150, height: 150}}
    />
  );
}
