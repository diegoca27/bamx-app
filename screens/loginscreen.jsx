import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Icon } from 'react-native-elements'
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react'; 
import { UserContext } from '../context/UserContext'; 

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext); 

  const onSubmit = async (data) => {
    try {
      // 1. Lógica de Autenticación
      
      // Simulacion de la entrada de datos
      const userData = {
        userType: 'persona',
        avatar: 'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2022-03/art-hauntington-0wrxaxqip58-unsplash.jpg?itok=DEJmZb4P',
        avatarBackground: 'https://thumbs.dreamstime.com/b/woman-holding-mask-her-happy-face-sad-67645678.jpg',
        name: 'Diana Bravo', 
        location: 'Zapopan, Jalisco, 45019',
        email: 'orrin2004@gmail.com',
        phone: '+52 425-770-0904',
      };

      // 2. Actualizar el contexto con los datos del usuario
      setUser(userData);

      // 3. Redirigir a "HomeTabs"
      navigation.navigate('HomeTabs');

    } catch (error) {
      // Manejar errores de autenticación
      console.error("Error en la autenticación:", error);
    }
  };

  return (
    <View style={styles.container}>
     <Image 
        style={styles.logo}
        source={require('../assets/logoBAMX.png')} 
     />
      <Text style={styles.title}>Inicio de sesión</Text>
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="usuario"
          rules={{ required: 'El usuario es requerido' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Usuario"
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
        {errors.usuario && <Text style={styles.errorText}>{errors.usuario.message}</Text>}

        <Controller
          control={control}
          name="contraseña"
          rules={{ required: 'La contraseña es requerida' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={true} 
              />
              <Icon
                 name='lock'
                 type='font-awesome'
                 color='#808080'
                 size={20}
              />
            </View>
          )}
        />
        {errors.contraseña && <Text style={styles.errorText}>{errors.contraseña.message}</Text>}

        <Button 
          title="Iniciar sesión" 
          onPress={handleSubmit(onSubmit)} 
          style={styles.button} 
          textStyle={styles.buttonText} 
        />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Regístrate</Text>

          </TouchableOpacity>
        </View>
      </View>
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
    color: '#ce0e2d',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ce0e2d',
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
    color: '#ce0e2d',
    fontWeight: 'bold'
  },
});

export default LoginScreen;