import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { Icon } from 'react-native-elements'
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react'; 
import { UserContext } from '../context/UserContext'; 
import { auth } from '../config/firebaseConfig'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext); 
  const [authError, setAuthError] = useState(null);

  const onSubmit = async (data) => {
    const { usuario, contraseña } = data;
    try {
      // 1. Lógica de Autenticación
      const userCredential = await signInWithEmailAndPassword(auth, usuario, contraseña);
      const user = userCredential.user;
      
      // Simulacion de la entrada de datos
      const userData = {
        userType: 'persona',
        //avatar: 'https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2022-03/art-hauntington-0wrxaxqip58-unsplash.jpg?itok=DEJmZb4P',
        avatar: 'https://www.informador.mx/__export/1684928035463/sites/elinformador/img/2023/05/24/banco_de_alimentos_x11373714x_crop1684928034621.jpg_423682103.jpg',
        avatarBackground: 'https://thumbs.dreamstime.com/b/woman-holding-mask-her-happy-face-sad-67645678.jpg',
        name: 'Banco de Alimentos GDA', 
        location: 'Zapopan, Jalisco, 45019',
        email: 'bdagda@gmail.com',
        phone: '+52 425-770-0904',
      };

      // 2. Actualizar el contexto con los datos del usuario
      setUser(userData);

      // 3. Redirigir a "HomeTabs"
      navigation.navigate('HomeTabs');

    } catch (error) {
      // Manejar errores de autenticación
      setAuthError(error.message);
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