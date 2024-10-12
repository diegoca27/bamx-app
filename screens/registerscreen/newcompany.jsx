import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import MultiStepForm from '../../components/MultiStepForm';
import * as ImagePicker from 'expo-image-picker'
import CountryPicker from 'react-native-country-picker-modal';
import globalStyles  from '../../styles/global';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const NewCompany = () => {
  const [image, setImage] = useState(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
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

  const [errorStep1, setErrorStep1] = useState({
    companyName: '',
    email: '',
    password: '',
    contactPhone: '',
  });

  const [errorStep2, setErrorStep2] = useState({
    address: '',
    contactPerson: '',
    website: '',
    companyRFC: '',
    restaurantImage: '',
  });

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmedpassword: '',
    address: '',
    contactPhone: '',
    contactPerson: '',
    website: '', 
    companyRFC: '',
    restaurantImage: '',
  });

  useEffect(() => {
    if (activeStep == 0){
      validateStep1();
    }
    else{
      validateStep2();
    }
    setPrevStep(activeStep)
  }, [activeStep, formData, isImageUploaded]); 

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
    const { companyName, email, password, contactPhone, address, contactPerson, website, companyRFC, restaurantImage } = formData;

  try {
    // Si no se ha seleccionado imagen, devuelve un mensaje de error
    const selectedData = {
      companyName,
      contactPhone,
      address,
      contactPerson,
      website,
      companyRFC,
      restaurantImage,
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
    await setDoc(doc(db, "company", user.uid), {
      ...selectedData,  // Incluye todos los datos del formulario, incluida la URL de la imagen
      uid: user.uid,
      userType: 'empresa',
      restaurantImage: downloadURL, // Asegúrate de que este campo siempre se guarde correctamente
    });

    console.log("Datos guardados exitosamente en Firestore");
  } catch (error) {
    console.error("error al registrar usuario o guardar datos:", error);
  }
  };

  const [showDatePicker, setShowDatePicker] = useState(false);

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const pickerRef = useRef(); 

  const openPicker = () => {
    if (pickerRef.current) {
      pickerRef.current.focus();
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

  const handlePhoneChange = (phoneNumber) => {
    setFormData({ ...formData, contactPhone: phoneNumber});
  };

  const validateStep1 = () => {
    setIsNextEnabled(false);
    const newErrors = {};
    // Validar Nombre
    if (formData.companyName == '') {
      newErrors.companyName = 'Este campo es obligatorio';
    }
  
    // Validar Correo Electrónico
    if (formData.email == '') {
      newErrors.email = 'Este campo es obligatorio';
    }
  
    // Validar Número de Teléfono
    if (formData.contactPhone.length < 10){
      newErrors.contactPhone = 'El número de teléfono debe ser válido'
    }
    else if (formData.phone == '') {
      newErrors.contactPhone = 'Este campo es obligatorio';
    }
  
    // Validar Contraseñas
    const { password, confirmedpassword } = formData;
    if (!password || !confirmedpassword) {
      newErrors.password = 'Ambos campos de contraseña son obligatorios';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (password !== confirmedpassword) {
      newErrors.password = 'Las contraseñas no coinciden';
    }
  
    // Establecer los errores
    setErrorStep1(newErrors);
  
    // Si no hay errores, habilitar el botón "Siguiente"
    const hasErrors = Object.keys(newErrors).length > 0;
    setIsNextEnabled(!hasErrors);
    };

    const validateStep2 = () => {
      setIsNextEnabled(false);
      const newErrors2 = {};
      if(formData.address == ''){
        newErrors2.address = 'Este campo es obligatorio';
      }
      if(formData.contactPerson == ''){
        newErrors2.contactPerson = 'Este campo es obligatorio';
      }
      if(formData.website == ''){
        newErrors2.website = 'Este campo es obligatorio';
      }
      if(formData.companyRFC == ''){
        newErrors2.companyRFC = 'Este campo es obligatorio';
      }
      if(!isImageUploaded){
        newErrors2.restaurantImage = 'Este campo es obligatorio';
      }
      setErrorStep2(newErrors2);
      
      // Si no hay errores, habilitar el botón "Siguiente"
      const hasErrors2 = Object.keys(newErrors2).length > 0;
      setIsNextEnabled(!hasErrors2 && isImageUploaded);
    };

  return (
    <View style={styles.container}>
      <MultiStepForm 
      onSubmit={handleSubmit} 
      currentStep={activeStep}
      onNext={handleNext}
      onPrevious={handleBack}
      isNextEnabled={isNextEnabled}
      >
        {/* Paso 1: Información Básica */}
        <View>
          <Text style={styles.label}>Nombre de la Empresa: <Text style = {styles.errorText}>*</Text></Text>
          <TextInput
            value={formData.companyName}
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, companyName: text })}
            placeholder="Ej. Tecnología Acme" 
          />
          {errorStep1 ? <Text style={styles.errorText}>{errorStep1.companyName}</Text> : null}
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
          {errorStep1 ? <Text style={styles.errorText}>{errorStep1.password}</Text> : null}
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.iconContainer}>
            <Icon
              name={confirmPasswordVisible ? 'eye' : 'eye-slash'}
              type="font-awesome"
              color="#808080"
              size={20}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Número de Teléfono: <Text style = {styles.errorText}>*</Text></Text>
          <View style={styles.phoneContainer}>
          <CountryPicker
              countryCode={'MX'}
              withFilter
              withFlag
              withCallingCode
            />
            <Text style={styles.countryCode}>+ 52</Text>
            <TextInput
              style={styles.phoneInput}
              value={formData.contactPhone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              placeholder="Ej. 333 000 0000"
            />
          </View>
            {errorStep1 ? <Text style={styles.errorText}>{errorStep1.contactPhone}</Text> : null}
        </View>

        {/* Paso 2: Información Adicional */}
        <View>
        <Text style={styles.label}>Dirección:</Text>
          <TextInput
            value={formData.address}
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, address: text })}
          />
          {errorStep2 ? <Text style={styles.errorText}>{errorStep2.address}</Text> : null}
          <Text style={styles.label}>Persona de contacto:</Text>
          <TextInput
            value={formData.contactPerson}
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, contactPerson: text })}
          />
          {errorStep2 ? <Text style={styles.errorText}>{errorStep2.contactPerson}</Text> : null}
          <Text style={styles.label}>Sitio Web:</Text>
          <TextInput
          value={formData.website}
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, website: text })}
            placeholder="Ej. www.ejemplo.com" 
            keyboardType="url" 
          />
          {errorStep2 ? <Text style={styles.errorText}>{errorStep2.website}</Text> : null}
          <Text style={styles.label}>RFC del restaurante:</Text>
          <TextInput
            value={formData.companyRFC}
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, companyRFC: text })}
          />
          {errorStep2 ? <Text style={styles.errorText}>{errorStep2.companyRFC}</Text> : null}
          <Text style={styles.label}>Imagen del Restaurante:</Text>
          <Button onPress={showImagePickerOptions} color={globalStyles.primaryRed.color} title='Seleccionar imagen'>
          </Button>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 400, height: 200, alignSelf: 'center', marginTop: 10}}
            />
          )}
          {errorStep2 ? <Text style={styles.errorText}>{errorStep2.restaurantImage}</Text> : null}
        </View>
      </MultiStepForm>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 12,
    color: 'black',
    paddingRight: 30, // Espacio para el icono
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // Espacio para el icono
  },

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
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
    borderWidth: 0.5,
    borderRadius: 12,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  errorText: {
    color: '#ce0e2d',
  },
});

export default NewCompany;
