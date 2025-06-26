import React, {useEffect, useState} from "react";
import { View, Dimensions, Text, StyleSheet } from "react-native";
import Animated, { 
	useSharedValue, 
	useAnimatedStyle,
	withTiming,
	withSpring,
	withRepeat 
} from "react-native-reanimated";

const SIZE = 30;

const LoaderAnimation = () => {
const progress = useSharedValue<number>(1);
const scale = useSharedValue<number>(2);

const animatedStyle = useAnimatedStyle(()=>{
	return {
		opacity: progress.value,
		transform: [
			{scale : scale.value},
			{rotate: `${progress.value * 2 * Math.PI}rad`}
		],
		borderRadius: (progress.value * SIZE)/2,
	}
},[])
 
useEffect(()=>{
	progress.value = withRepeat(withSpring(0.5), 10, true);
	scale.value = withRepeat(withSpring(1), 10, true)
},[])



  return (
    <View style={styles.container}>
		<Animated.View style={[styles.objectStyle,animatedStyle]} />
    </View>
  )
}
 
export default LoaderAnimation;

const styles = StyleSheet.create({
	container:{
		flex:1,
		justifyContent:'center',
		alignItems:'center'
	},
	objectStyle:{
		width:SIZE,
		height:SIZE,
		backgroundColor:'blue'
	}
})

