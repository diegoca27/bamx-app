import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Icon } from 'react-native-elements';

const RegisterScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Aquí manejarías la lógica de registro,
    // enviando los datos a tu API.
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/logoBAMX.png')}
      />
      <Text style={styles.title}>Registro</Text>
      <View style={styles.formContainer}>
        {/* Campos del Formulario de Registro */}
        <Controller 
          control={control}
          name="nombre"
          rules={{ required: 'El nombre es requerido' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              <Icon 
                name='user'
                type='font-awesome'
                color='#808080'
                size={20}
              />
            </View>
          )}
        />
        {errors.nombre && <Text style={styles.errorText}>{errors.nombre.message}</Text>}

        {/* Repite la estructura para los demás campos: 
            - usuario
            - correo electrónico
            - contraseña
            - confirmar contraseña 
        */}

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Estilos (puedes usar los mismos que en LoginScreen o crear unos nuevos)
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
  logo: {
    width: 210, 
    height: 150,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
   flexDirection: 'row', 
   alignItems: 'center',
   borderBottomWidth: 1, 
   borderBottomColor: '#ccc',
   marginBottom: 15, 
  },
  input: {
    flex: 1, 
    padding: 10, 
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#808080',
  },
  registerLink: {
    color: 'blue',
  },
});

export default RegisterScreen;