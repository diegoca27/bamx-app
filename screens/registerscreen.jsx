import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';

const RegisterScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo quieres registrarte?</Text>

      <Button
        title="Registrarme como Persona"
        onPress={() => navigation.navigate('RegisterPerson')}
        style={[styles.button, { backgroundColor: '#f5a800' }]}
      />

      <Button
        title="Registrarme como Empresa"
        onPress={() => navigation.navigate('RegisterCompany')}
        style={[styles.button, { backgroundColor: '#ce0e2d' }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
  },
});

export default RegisterScreen;