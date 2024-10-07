import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Icon } from 'react-native-elements';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react'; 
import { UserContext } from '../context/UserContext'; 
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext); 
  const [authError, setAuthError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  const onSubmit = async (data) => {
    const { usuario, contraseña } = data;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, usuario, contraseña);
      const user = userCredential.user;
      
      const userData = {
        userType: 'persona',
        avatar: 'https://www.informador.mx/__export/1684928035463/sites/elinformador/img/2023/05/24/banco_de_alimentos_x11373714x_crop1684928034621.jpg_423682103.jpg',
        avatarBackground: 'https://thumbs.dreamstime.com/b/woman-holding-mask-her-happy-face-sad-67645678.jpg',
        name: 'Banco de Alimentos GDA', 
        location: 'Zapopan, Jalisco, 45019',
        email: 'bdagda@gmail.com',
        phone: '+52 425-770-0904',
      };

      setUser(userData);
      navigation.navigate('HomeTabs');
    } catch (error) {
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
                accessibilityLabel="Usuario" 
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
                onBlur={() => setIsTypingPassword(false)} 
                onFocus={() => setIsTypingPassword(true)}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!passwordVisible} // Mostrar u ocultar contraseña
              />
              {isTypingPassword && ( // Mostrar ojito solo cuando se está escribiendo y hay texto
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Icon
                    name={passwordVisible ? 'eye' : 'eye-slash'}
                    type='font-awesome'
                    color='#808080'
                    size={20}
                  />
                </TouchableOpacity>
              )}
                secureTextEntry={true} 
                accessibilityLabel="Contraseña"
              />
              <Icon
                name='lock'
                type='font-awesome'
                color='#808080'
                size={20}
                style={styles.icon}
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
          accessibilityLabel="Iniciar sesión"
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
  icon: {
    marginLeft: 20,
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
