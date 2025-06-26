import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useAuthContexts } from '../../contexts/AuthContext';


const LogoutButton = () => {
  const {logout } = useAuthContexts();
    
  const handleLogout = async () => {
      try {
       await logout(); // Call the logout function
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
  return (
    <View style={styles.container}>
        <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
        >
            <Icon 
              name='logout' 
              color={'#d4d4d4'} 
              size={40}
              />
        </TouchableOpacity>
    </View>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center'
  },
  logoutButton:{
    alignItems: 'flex-end'
  }
});
