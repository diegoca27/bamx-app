import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, Platform, TouchableOpacity, Image, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import MultiStepForm from '../../components/MultiStepForm';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryPicker from 'react-native-country-picker-modal';
import globalStyles from '../../styles/global';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const NewPerson = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passwordError, setpasswordError] =  useState('');
  const [errorStep1, setErrorStep1] = useState({
    name: '',
    email: '',
    birthDate: '',
    phone: '',
    URLPhoto: '',
  });

  const [errorStep2, setErrorStep2] = useState({
    address: '',
    colonia: '',
    city: '',
    postalCode: '',
  });

  const [errorStep3, setErrorStep3] = useState({
    householdSize: '',
    monthlyIncome: '',
    hasDisability: '',
  });

  const [errorStep4, setErrorStep4] = useState({
    acceptTerms: '',
  })

  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [prevStep, setPrevStep] = useState(0);

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prevStep => prevStep - 1);
    }
  };
  
  const [image, setImage] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

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
    URLPhoto:'',
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

  useEffect(() => {
    if (activeStep == 0){
      validateStep1();
    }
    else if (activeStep == 1){
      validateStep2();
    }
    else if (activeStep == 2){
      validateStep3();
    }
    else{
      validateStep4();
    }
    setPrevStep(activeStep)
  }, [activeStep, formData, isImageUploaded]); 

  const handleBirthDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      setFormData({ ...formData, birthDate: selectedDate});
    }
    setShowDatePicker(false);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const formattedBirthDate = formData.birthDate ? formData.birthDate.toLocaleDateString() : '';

  const toggleState = () => {
    if(!isNextEnabled){
      setIsNextEnabled(true);
    }
    else{
      setIsNextEnabled(false);
    }
  };

  const pickImage = async (fromCamera = true) => {
    // Solicitar permisos
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraPermissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false || cameraPermissionResult.granted === false) {
      alert("Es necesario otorgar permisos para acceder a la cámara o galería.");
      return;
    }

    let result;

    if (fromCamera) {
      // Lanzar la cámara
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      // Lanzar la galería
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri; // Obtener la URI local de la imagen
      setImage(selectedImageUri); // Actualizar la imagen localmente
      setIsImageUploaded(true);   // Marcar que ya se tiene una imagen localmente
      console.log('Imagen seleccionada localmente');
    }
  };

  const showImagePickerOptions = () => {
    // Mostrar opciones para elegir entre cámara o galería
    Alert.alert(
      "Seleccionar Imagen",
      "Elige si deseas tomar una nueva foto o seleccionar una de la galería.",
      [
        {
          text: "Tomar Foto",
          onPress: () => pickImage(true), // Abrir cámara
        },
        {
          text: "Seleccionar de la Galería",
          onPress: () => pickImage(false), // Abrir galería
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]
    );
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
        URLPhoto: downloadURL, // Añade el campo de la URL de la imagen
      }));
  
      return downloadURL; // Devuelve la URL para confirmar la subida
    } catch (error) {
      console.error('error al subir la imagen: ', error);
      throw new error('error al subir la imagen'); // Lanza un error si falla la subida
    }
  };

  const handleSubmit = async() => {
    const { name, password, birthDate, phone, countryCode, country, email, URLPhoto, address, colonia } = formData;

  try {
    // Si no se ha seleccionado imagen, devuelve un mensaje de error
    const selectedData = {
      name,
      birthDate,
      phone,
      countryCode,
      country,
      email,
      URLPhoto,
      address,
      colonia,
    };

    // Subir la imagen primero
    const downloadURL = await handleImageUpload(image);
    if (!downloadURL) {
      console.error("error en la subida de la imagen.");
      return;
    }

    // Crear el usuario con email y contraseña
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuario registrado exitosamente:", user);

    // Guardar los datos del formulario en Firestore con la URL de la imagen
    await setDoc(doc(db, "users", user.uid), {
      ...selectedData,  // Incluye todos los datos del formulario, incluida la URL de la imagen
      uid: user.uid,
      userType: 'persona',
      URLPhoto: downloadURL, // Asegúrate de que este campo siempre se guarde correctamente
    });

    console.log("Datos guardados exitosamente en Firestore");
  } catch (error) {
    console.error("error al registrar usuario o guardar datos:", error);
  }
  };

  const validateStep1 = () => {
  setIsNextEnabled(false);
  const newErrors = {};
  // Validar Nombre
  if (formData.name == '') {
    newErrors.name = 'Este campo es obligatorio';
  }

  // Validar Correo Electrónico
  if (formData.email == '') {
    newErrors.email = 'Este campo es obligatorio';
  }

  // Validar Fecha de Nacimiento
  if (!formData.birthDate) {
    newErrors.birthDate = 'Este campo es obligatorio';
  }

  // Validar Número de Teléfono
  if (formData.phone.length < 10){
    newErrors.phone = 'El número de teléfono debe ser válido'
  }
  else if (formData.phone == '') {
    newErrors.phone = 'Este campo es obligatorio';
  }

  // Validar Imagen de Identificación (URL de la imagen)
  if (!isImageUploaded) {
    newErrors.URLPhoto = 'Este campo es obligatorio';
  }

  // Validar Contraseñas
  const { password, confirmedpassword } = formData;
  if (!password || !confirmedpassword) {
    newErrors.password = 'Ambos campos de contraseña son obligatorios';
    newErrors.confirmedpassword = 'Ambos campos de contraseña son obligatorios';
  } else if (password.length < 6) {
    newErrors.confirmedpassword = 'La contraseña debe tener al menos 6 caracteres';
  } else if (password !== confirmedpassword) {
    newErrors.confirmedpassword = 'Las contraseñas no coinciden';
  }

  // Establecer los errores
  setErrorStep1(newErrors);

  // Si no hay errores, habilitar el botón "Siguiente"
  const hasErrors = Object.keys(newErrors).length > 0;
  setIsNextEnabled(!hasErrors && isImageUploaded);
  };
  
  const printForm = () => {
    console.log(formData);
  }

  const validateStep2 = () => {
    setIsNextEnabled(false);
    const newErrors2 = {};
    if(formData.address == ''){
      newErrors2.address = 'Este campo es obligatorio';
    }
    if(formData.colonia == ''){
      newErrors2.colonia = 'Este campo es obligatorio';
    }
    if(formData.city == ''){
      newErrors2.city = 'Este campo es obligatorio';
    }
    if(formData.postalCode == ''){
      newErrors2.postalCode = 'Este campo es obligatorio';
    }
    setErrorStep2(newErrors2);
    
    // Si no hay errores, habilitar el botón "Siguiente"
    const hasErrors2 = Object.keys(newErrors2).length > 0;
    setIsNextEnabled(!hasErrors2);
  };

  const validateStep3 = () => {
    setIsNextEnabled(false);
    const newErrors3 = {};
    if(formData.householdSize == ''){
      newErrors3.householdSize = 'Este campo es obligatorio';
    }
    if(formData.monthlyIncome == ''){
      newErrors3.monthlyIncome = 'Este campo es obligatorio';
    }
    
    setErrorStep3(newErrors3);

    // Si no hay errores, habilitar el botón "Siguiente"
    const hasErrors3 = Object.keys(newErrors3).length > 0;
    setIsNextEnabled(!hasErrors3);
  };

  const validateStep4 = () => {
    const newErrors4 = {};
    setIsNextEnabled(false);
    if(formData.acceptTerms == false){
      newErrors4.acceptTerms = 'Este campo es obligatorio';
    }

    setErrorStep4(newErrors4);
    const hasErrors4 = Object.keys(newErrors4).length > 0;
    setIsNextEnabled(!hasErrors4);
  }

  const handlePhoneChange = (phoneNumber) => {
    setFormData({ ...formData, phone: phoneNumber});
  };

  const handleCountryChange = (country) => {
    setFormData({ ...formData, countryCode: country.callingCode[0], country: country.cca2 });
  };

  return (
    <View style={styles.container}>
      <MultiStepForm 
      onSubmit={handleSubmit} 
      currentStep={activeStep}
      onNext={handleNext}
      onPrevious={handleBack}
      isNextEnabled={isNextEnabled}>
        {/* Paso 1: Información Personal */}
        <View>
          <Text style={styles.label}>Nombre Completo: <Text style = {styles.errorText}>*</Text></Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => {
              setFormData({ ...formData, name: text });
            }}
            value={formData.name}
            placeholder="Ej. Cosme Ramirez Anaya"
            />
          {errorStep1 ? <Text style={styles.errorText}>{errorStep1.name}</Text> : null}
          <View>
          <Text style={styles.label}>Correo Electrónico: <Text style = {styles.errorText}>*</Text></Text>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              setFormData({ ...formData, email: text });
            }}
            value={formData.email}
            keyboardType="email-address"
            placeholder="Ej. ejemplo@correo.com"
          />
          {errorStep1 ? <Text style={styles.errorText}>{errorStep1.email}</Text> : null}
          <Text style={styles.label}>Contraseña: <Text style = {styles.errorText}>*</Text></Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={text => { setFormData({ ...formData, password: text });}}
          value={formData.password}
          secureTextEntry={!passwordVisible}
          placeholder="Contraseña"
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

          <Text style={styles.label}>Confirmar contraseña: <Text style = {styles.errorText}>*</Text></Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={text => { setFormData({ ...formData, confirmedpassword: text });}}
            value={formData.confirmedpassword}
            secureTextEntry={!confirmPasswordVisible}
            placeholder="Confirmar contraseña"
          />
          {errorStep1 ? <Text style={styles.errorText}>{errorStep1.confirmedpassword}</Text> : null}
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.iconContainer}>
            <Icon
              name={confirmPasswordVisible ? 'eye' : 'eye-slash'}
              type="font-awesome"
              color="#808080"
              size={20}
            />
          </TouchableOpacity>
        </View>
          
          {passwordError ? <Text style={styles.errorText}>{errorStep1.password}</Text> : null}
          </View> 
          <Text style={styles.label}>Fecha de Nacimiento: <Text style = {styles.errorText}>*</Text></Text>
          <View style={{marginBottom: 10}}> 
            <Text style={styles.dateText}>{formattedBirthDate}</Text>
            <Button onPress={showDatepicker} title="Seleccionar Fecha" color={globalStyles.primaryRed.color}/>
            {showDatePicker && (
              <DateTimePicker
                value={formData.birthDate ? new Date(formData.birthDate) : new Date()}
                mode="date"
                display="default" 
                onChange={handleBirthDateChange}
              />
            )}
          </View> 
            {errorStep1 ? <Text style={styles.errorText}>{errorStep1.birthDate}</Text> : null}
          <Text style={styles.label}>Número de Teléfono: <Text style = {styles.errorText}>*</Text></Text>
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
              value={formData.phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              placeholder="Ej. 333 000 0000"
            />
          </View>
          {errorStep1 ? <Text style={styles.errorText}>{errorStep1.phone}</Text> : null}
            <View style={{marginBottom: 10}}>
              <Text style={styles.label}>Sube una imagen de tu identificación: <Text style = {styles.errorText}>*</Text></Text>
            <Button title="Seleccionar Imagen" onPress={showImagePickerOptions} color={globalStyles.primaryRed.color}/>
            {image && <Image source={{ uri: image }} style={{ width: 400, height: 200, alignSelf: 'center', marginTop: 10}} />}
            </View>
            {errorStep1 ? <Text style={styles.errorText}>{errorStep1.URLPhoto}</Text> : null}
        </View>
        
        {/* Paso 2: Información de Dirección */}
        <View>
          <Text style={styles.label}>Dirección (Calle y Número):</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, address: text })}
            value={formData.address}
          />
          {errorStep2 ? <Text style={styles.errorText}>{errorStep2.address}</Text> : null}
          <Text style={styles.label}>Colonia:</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, colonia: text })}
            value={formData.colonia}
          />
          {errorStep2 ? <Text style={styles.errorText}>{errorStep2.colonia}</Text> : null}
          <Text style={styles.label}>Ciudad:</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, city: text })}
            value={formData.city}
          />
          {errorStep2 ? <Text style={styles.errorText}>{errorStep2.city}</Text> : null}
          <Text style={styles.label}>Código Postal:</Text>
          <TextInput 
            style={styles.input}
            keyboardType="numeric"
            onChangeText={text => setFormData({ ...formData, postalCode: text })}
            value={formData.postalCode}
          />
          {errorStep2 ? <Text style={styles.errorText}>{errorStep2.postalCode}</Text> : null}
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
          {errorStep3 ? <Text style={styles.errorText}>{errorStep3.householdSize}</Text> : null}
          <Text style={styles.label}>Ingreso Mensual del Hogar (Rango):</Text>
          <TextInput 
            style={styles.input}
            keyboardType='numeric'
            onChangeText={text => setFormData({ ...formData, monthlyIncome: text })}
            value={formData.monthlyIncome}
          />
          {errorStep3 ? <Text style={styles.errorText}>{errorStep3.monthlyIncome}</Text> : null}
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
          <Text style={styles.label}>Acepto los términos y condiciones <Text style={styles.errorText}>*</Text></Text>
          <Switch 
            value={formData.acceptTerms} 
            onValueChange={value => setFormData({ ...formData, acceptTerms: value })}
          />
          {errorStep4 ? <Text style={styles.errorText}>{errorStep4.acceptTerms}</Text> : null}
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
    marginBottom: 10,
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
  },
  dateText: {
    alignSelf: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
});

export default NewPerson;
