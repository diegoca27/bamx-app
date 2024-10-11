import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Icon } from 'react-native-elements';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';
import { auth, firestore } from '../config/firebaseConfig';  
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';  

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigation = useNavigation();
  const { setUser, setUserType } = useContext(UserContext);
  const [authError, setAuthError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  const onSubmit = async (data) => {
    const { email, password } = data;
  
    try {
      // Iniciar sesión con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Buscar el usuario primero en la colección "users"
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
  
      if (userDoc.exists()) { 
        // Si existe en "users", cargar los datos
        const userData = userDoc.data();
        setUser(userData);  // Guardar usuario en el contexto
        setUserType(userData.userType);  // Guardar el tipo de usuario en el contexto
        navigation.navigate('HomeTabs');
      } else {
        // Si no existe en "users", buscar en "companies"
        const companyDoc = await getDoc(doc(firestore, 'companies', user.uid));
        if (companyDoc.exists()) {
          // Si el usuario está en "companies", cargar los datos
          const companyData = companyDoc.data();
          setUser(companyData);  // Guardar usuario en el contexto
          setUserType(companyData.userType);  // Guardar el tipo de usuario en el contexto
          navigation.navigate('HomeTabs');
        } else {
          // Si no se encuentra en ninguna colección, mostrar error
          setAuthError('Usuario no encontrado en ninguna colección.');
        }
      }
    } catch (error) {
      // Manejo de errores en caso de fallar el inicio de sesión
      setAuthError('Error al iniciar sesión. Por favor, revisa tus credenciales.');
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
        name="email" 
        rules={{ required: 'El correo electrónico es requerido' }}  
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"  
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"  
              autoCapitalize="none" 
              accessibilityLabel="Correo electrónico" 
            />
            <Icon
              name='envelope'
              type='font-awesome'
              color='#808080'
              size={20}
            />
          </View>
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}


        <Controller
          control={control}
          name="password"
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
                secureTextEntry={!passwordVisible} 
                accessibilityLabel="Contraseña"
              />
              {isTypingPassword && (
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Icon
                    name={passwordVisible ? 'eye' : 'eye-slash'}
                    type='font-awesome'
                    color='#808080'
                    size={20}
                  />
                </TouchableOpacity>
              )}
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

        {authError && <Text style={styles.errorText}>{authError}</Text>}

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
