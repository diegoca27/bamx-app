import React from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

function BarElement(props){
    return(
        <View style = {styles.barelement}>
            <Ionicons name={props.icon} size={30}/>
            <Text>{props.text}</Text>
        </View>
    );
}

export default function NavBar(){
    return(
        <View style = {styles.container}>
            <BarElement icon='home-outline' text='Inicio'/>
            <BarElement icon='archive-outline' text='Historial'/>
            <BarElement icon='person-outline' text='Perfil'/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      paddingHorizontal: '20',
    },
    barelement: {
        alignItems: 'center',
        marginHorizontal: 40,
    },
  });