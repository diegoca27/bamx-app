import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import ProfileHeader from '../components/profileheader.jsx';
import ProfileInfo from '../components/profileinfo.jsx';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext.js';

export default function ProfileScreen() {
  const { user } = useContext(UserContext); 

  // Renderizar el perfil solo si user está definido
  if (user.userType == 'persona') { 
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileHeader
          avatar={user.IDPhoto}
          avatarBackground={user.IDPhoto}
          name={user.name}
          location={user.location}
        />
        <ProfileInfo
          email={user.email}
          phone={user.phone}
          // ... otras props
        />
      </ScrollView>
    );
  } 
  else if(user.userType == 'empresa'){
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileHeader
          avatar={user.restaurantImage}
          avatarBackground={user.restaurantImage}
          name={user.companyName}
          location={user.address}
        />
        <ProfileInfo
          email={user.email}
          phone={user.contactPhone}
          // ... otras props
        />
      </ScrollView>
    );
  }
  else {
    return ( 
      <View style={styles.container}>
        <Text>Cargando perfil...</Text> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5', 
  },
});