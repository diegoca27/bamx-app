import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import globalStyles from '../styles/global';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState(null);

  const handlePress = (type) => {
    setSelectedType(type);
    if (type === 'persona') {
      navigation.navigate('RegisterPerson');
    } else if (type === 'empresa') {
      navigation.navigate('RegisterCompany');
    }
  };

  return (
    <View style={styles.container}>
      {/* Flecha de regreso */}
      {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={globalStyles.primaryRed.color} />
      </TouchableOpacity> */}
      
      {/* Contenido de la pantalla */}
      <View style={styles.content}>
        {/* Aquí va el contenido de la pantalla */}
      </View>
      <Text style={styles.title}>¿Cómo quieres registrarte?</Text>

      {/* Botón para Persona */}
      <TouchableOpacity 
        style={[styles.button, selectedType === 'persona' && styles.buttonSelected]} 
        onPress={() => handlePress('persona')}
      >
        <Icon 
          name={selectedType === 'persona' ? 'person' : 'person-outline'}
          type="ionicon" 
          size={40} 
          color={selectedType === 'persona' ? globalStyles.primaryRed.color : 'gray'} 
        />
        <Text style={styles.buttonText}>Persona</Text>
      </TouchableOpacity>

      {/* Botón para Empresa */}
      <TouchableOpacity 
        style={[styles.button, selectedType === 'empresa' && styles.buttonSelected]} 
        onPress={() => handlePress('empresa')}
      >
        <Icon 
          name={selectedType === 'empresa' ? 'business' : 'business-outline'}
          type="ionicon" 
          size={40} 
          color={selectedType === 'empresa' ? globalStyles.primaryRed.color : 'gray'} 
        />
        <Text style={styles.buttonText}>Empresa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white', // Fondo blanco
    paddingTop: 40,
  },
  backButton: {
    marginLeft: 15,
  },
  title: {
    color: globalStyles.primaryRed.color,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40, // Más espacio inferior
  },
  button: {
    flexDirection: 'row', // Para alinear el icono y el texto
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: 'white', // Fondo blanco para los botones
    borderWidth: 2,
    borderColor: 'lightgray', 
    padding: 20,
    borderRadius: 10, 
    marginBottom: 20, 
    width: '80%',
  },
  buttonSelected: {
    borderColor: globalStyles.primaryRed.color, // Borde rojo cuando está seleccionado
  },
  buttonText: {
    marginLeft: 10, 
    fontSize: 18,
    color: 'gray', 
  },
});

export default RegisterScreen;