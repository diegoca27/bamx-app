import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, Platform, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import MultiStepForm from '../../components/MultiStepForm';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryPicker from 'react-native-country-picker-modal';
import globalStyles from '../../styles/global';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const NewPerson = () => {

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] =  useState('');
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [image, setImage] = useState(null);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    phone: '',
    countryCode: '52',
    country: 'MX',
    email: '',
    password: '',
    confirmedpassword: '',
    IDPhoto:'',
    address: '',
    colonia: '',
    city: '',
    postalCode: '',
    householdSize: '',
    monthlyIncome: '',
    hasDisability: false,
    disabilityDetails: '',
    receiveNotifications: false,
    foodPreference: '',
    acceptTerms: false,
  });

  const handleBirthDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // En iOS hay que ocultarlo manualmente
    if (event.type === 'set') {
      setFormData({ ...formData, birthDate: selectedDate });
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const selectImage = async () => {
    // Pide permiso para acceder a la galería
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Se necesita permiso para acceder a la galería.");
      return;
    }

    // Abre la galería para seleccionar una imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleImageUpload = async(uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
  
      const storage = getStorage();
      const storageRef = ref(storage, `images/${Date.now()}`);
  
      // Subir la imagen
      const snapshot = await uploadBytes(storageRef, blob);
      console.log('Imagen subida exitosamente', snapshot.metadata.name);
  
      // Obtener la URL de descarga de la imagen
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('URL de la imagen: ', downloadURL);
  
      // Actualiza formData con la URL de la imagen
      setFormData((prevData) => ({
        ...prevData,
        IDPhoto: downloadURL, // Añade el campo de la URL de la imagen
      }));
  
      return downloadURL; // Devuelve la URL para confirmar la subida
    } catch (error) {
      console.error('Error al subir la imagen: ', error);
      throw new Error('Error al subir la imagen'); // Lanza un error si falla la subida
    }
  };

  const handleSubmit = async() => {
    const { email, password, IDPhoto } = formData;

  // Verifica que los campos importantes existan
  if (!email || !password) {
    console.error('Faltan el correo electrónico o la contraseña');
    return;
  }

  try {
    // Si no se ha seleccionado imagen, devuelve un mensaje de error
    if (!image) {
      alert("Por favor, selecciona una imagen de identificación antes de continuar.");
      return;
    }

    // Subir la imagen primero
    const downloadURL = await handleImageUpload(image);
    if (!downloadURL) {
      console.error("Error en la subida de la imagen.");
      return;
    }

    // Crear el usuario con email y contraseña
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuario registrado exitosamente:", user);

    // Guardar los datos del formulario en Firestore con la URL de la imagen
    await addDoc(collection(db, "users"), {
      ...formData,  // Incluye todos los datos del formulario, incluida la URL de la imagen
      uid: user.uid,
      IDPhoto: downloadURL, // Asegúrate de que este campo siempre se guarde correctamente
    });

    console.log("Datos guardados exitosamente en Firestore");
  } catch (error) {
    console.error("Error al registrar usuario o guardar datos:", error);
  }
  };

  const validatePassword= () => {
    const { password, confirmedpassword } = formData;
    if (!password || !confirmedpassword) {
      setError('Ambos campos de contraseña son obligatorios');
      setIsNextEnabled(false);
    }
    else if (password.length < 6){
      setError('La contrasena tiene que tener al menos 6 caracteres');
      setIsNextEnabled(false);
    }
    else if (password !== confirmedpassword) {
      setError('Las contraseñas no coinciden');
      setIsNextEnabled(false);
    } else {
      setError('');
      setIsNextEnabled(true);
    }
  };

  const handlePhoneChange = (phoneNumber) => {
    setFormData({ ...formData, phoneNumber });
  };

  const handleCountryChange = (country) => {
    setFormData({ ...formData, countryCode: country.callingCode[0], country: country.cca2 });
  };

  return (
    <View style={styles.container}>
      <MultiStepForm onSubmit={handleSubmit} isNextEnabled={isNextEnabled}>
        {/* Paso 1: Información Personal */}
        <View>
          <Text style={styles.label}>Nombre Completo:</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, name: text })}
            value={formData.name}
            placeholder="Ej. Cosme Ramirez Anaya"
          />
          <View>
          <Text style={styles.label}>Correo Electrónico:</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            placeholder="Ej. ejemplo@correo.com"
          />
          <Text style={styles.label}>Contraseña:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={text => { setFormData({ ...formData, password: text }); validatePassword(); }}
          secureTextEntry={!passwordVisible}
          placeholder="Contraseña"
          onBlur={validatePassword}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.iconContainer}
        >
          <Icon
            name={passwordVisible ? 'eye' : 'eye-slash'}
            type="font-awesome"
            color="#808080"
            size={20}
          />
        </TouchableOpacity>
      </View>

          <Text style={styles.label}>Confirmar contraseña:</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={text => { setFormData({ ...formData, confirmedpassword: text }); validatePassword(); }}
            secureTextEntry={!confirmPasswordVisible}
            placeholder="Confirmar contraseña"
            onBlur={validatePassword}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.iconContainer}>
            <Icon
              name={confirmPasswordVisible ? 'eye' : 'eye-slash'}
              type="font-awesome"
              color="#808080"
              size={20}
            />
          </TouchableOpacity>
        </View>

          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View> 
          <Text style={styles.label}>Fecha de Nacimiento:</Text>
          <View> 
            <Button onPress={showDatepicker} title="Seleccionar Fecha" color={globalStyles.primaryRed.color} />
            {showDatePicker && (
              <DateTimePicker
                value={formData.birthDate ? new Date(formData.birthDate) : new Date()}
                mode="date"
                display="default" 
                onChange={handleBirthDateChange}
              />
            )}
          </View> 
          <Text style={styles.label}>Número de Teléfono:</Text>
          <View style={styles.phoneContainer}>
          <CountryPicker
              countryCode={formData.country}
              withFilter
              withFlag
              withCallingCode
              onSelect={handleCountryChange}
            />
            <Text style={styles.countryCode}>+{formData.countryCode}</Text>
            <TextInput
              style={styles.phoneInput}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              placeholder="Ej. 333 000 0000"
            />
          </View>
            <View>
              <Text style={styles.label}>Sube una imagen de tu identificación</Text>
            <Button title="Seleccionar Imagen" onPress={selectImage} color={globalStyles.primaryRed.color} />
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            </View>
        </View>
        
        {/* Paso 2: Información de Dirección */}
        <View>
          <Text style={styles.label}>Dirección (Calle y Número):</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, address: text })}
            value={formData.address}
          />
          <Text style={styles.label}>Colonia:</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, colonia: text })}
            value={formData.colonia}
          />
          <Text style={styles.label}>Ciudad:</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, city: text })}
            value={formData.city}
          />
          <Text style={styles.label}>Código Postal:</Text>
          <TextInput 
            style={styles.input}
            keyboardType="numeric"
            onChangeText={text => setFormData({ ...formData, postalCode: text })}
            value={formData.postalCode}
          />
        </View>
        
        {/* Paso 3: Información Familiar */}
        <View>
          <Text style={styles.label}>Número de Personas en el Hogar:</Text>
          <TextInput 
            style={styles.input}
            keyboardType="numeric"
            onChangeText={text => setFormData({ ...formData, householdSize: text })}
            value={formData.householdSize}
          />
          <Text style={styles.label}>Ingreso Mensual del Hogar (Rango):</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, monthlyIncome: text })}
            value={formData.monthlyIncome}
          />
          <Text style={styles.label}>¿Posee algún tipo de discapacidad o necesidad especial?</Text>
          <Switch 
            value={formData.hasDisability} 
            onValueChange={value => setFormData({ ...formData, hasDisability: value })}
          />
          {formData.hasDisability && (
            <TextInput 
              style={styles.input}
              placeholder="Especifique"
              onChangeText={text => setFormData({ ...formData, disabilityDetails: text })}
              value={formData.disabilityDetails}
            />
          )}
        </View>
        
        {/* Paso 4: Preferencias y Términos */}
        <View>
          <Text style={styles.label}>¿Está dispuesto a recibir notificaciones de nuevas oportunidades?</Text>
          <Switch 
            value={formData.receiveNotifications} 
            onValueChange={value => setFormData({ ...formData, receiveNotifications: value })}
          />
          <Text style={styles.label}>Acepto los términos y condiciones</Text>
          <Switch 
            value={formData.acceptTerms} 
            onValueChange={value => setFormData({ ...formData, acceptTerms: value })}
          />
        </View>
      </MultiStepForm>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  countryCode: {
    marginLeft: 10,
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  errorText: {
    color: '#ce0e2d',
    marginBottom: 10,
  },
});

export default NewPerson;
