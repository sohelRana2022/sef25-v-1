import React from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { IMG_API } from '../../apis/config';
import {THEME} from '../../lib/configs/Theme';
import LogoutButton from '../Buttons/LogoutButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useAuthContexts } from '../../contexts/AuthContext';

type  UserHomeHeaderProps = {
    navigation: NativeStackNavigationProp<any, any>;
    route: RouteProp<any, any>   
    options?:{},
    back?:()=> void,
}

const UserHomeHeader = ({ navigation, route}: UserHomeHeaderProps) => {
    const {user} = useAuthContexts();
    return (
    <View style={styles.container}>
        <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
            <View style={styles.headerLeft}>
                <Image 
                    source={{uri: IMG_API+user?.imageId}}
                    width={60}
                    height={60}
                    style={{borderRadius:50}}
                />
                <View style={{paddingLeft:25}}>
                    <Text style={styles.welcomeText}>স্বাগতম</Text>     
                    <Text style={styles.userNameText}>{user?.nameBang}</Text>
                    <Text style={styles.userBranch}>{user?.title}</Text>
                </View>
            </View>
            <View style={styles.headerRight}>
                <LogoutButton navigation={navigation} route={route} />
            </View>
        </View>      
    </View>);
};

export default UserHomeHeader;

const styles = StyleSheet.create({
    container: {
        minHeight:80,
        padding:10, 
        backgroundColor: '#0B2447',
        borderBottomEndRadius:50,
        borderBottomStartRadius:50
    },
    headerLeft: {
        alignItems: 'center', 
        flexDirection:'row',
        justifyContent:'flex-start', 
        width:'75%',
        paddingLeft:20,
    },
    headerRight: {
        alignItems: 'center', 
        justifyContent:'center', 
        width:'25%'
    },
    welcomeText:{
        color:THEME.TEXTCOLORPRIMARY, 
        fontSize:15,
        fontFamily:'HindSiliguri-SemiBold'
    },
    userNameText:{
        color:THEME.TEXTCOLORPRIMARY, 
        fontSize:18,
        fontFamily:'HindSiliguri-Regular',
        lineHeight:25,
    },
    userBranch:{
        color:THEME.TEXTCOLORPRIMARY, 
        fontSize:THEME.TEXTSIZESECONDARY, 
        lineHeight:20,
        fontFamily:'HindSiliguri-Regular'
    }
});
