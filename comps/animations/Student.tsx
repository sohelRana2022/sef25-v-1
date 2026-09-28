import React from 'react';
import LottieView from 'lottie-react-native';

export default function Student() {
  return (
    <LottieView
      source={require('../../lib/lottie_animations/student.json')}
      autoPlay
      loop
      style={{width: 150, height: 150}}
    />
  );
}
