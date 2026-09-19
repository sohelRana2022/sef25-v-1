import React from 'react';
import LottieView from 'lottie-react-native';

export default function Loading() {
  return (
    <LottieView
      source={require('../../lib/lottie_animations/loading.json')}
      autoPlay
      loop
      style={{width: 100, height: 100}}
    />
  );
}
