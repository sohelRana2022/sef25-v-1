import React from 'react';
import LottieView from 'lottie-react-native';

export default function Education() {
  return (
    <LottieView
      source={require('../../lib/lottie_animations/education.json')}
      autoPlay
      loop
      style={{width: '100%', height: 200, marginBottom: 20}}
    />
  );
}
