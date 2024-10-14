import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, Alert, Image, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { getAuth } from "firebase/auth";
import globalStyles from '../styles/global';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";

export default function NewOrderScreen() {
const navigation = useNavigation();
const [image, setImage] = useState(null);
const [isImageUploaded, setIsImageUploaded] = useState(false);
const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
const [errorStep, setErrorStep] = useState({
    productName: '',
    offerPrice: '',
    normalPrice: '',
    foodImage: '',
  });
  const [formData, setFormData] = useState({
    productName: '',
    quantity: 1,
    offerPrice: '',
    normalPrice: '',
    orderTime: '',
    foodImage: '',
    additionalNotes: '',
  });

  useEffect(() => {
    validateAlert();
  }, [formData, isImageUploaded]);

  const incrementQuantity = () => {
    setFormData({ ...formData, quantity: formData.quantity + 1 });
  };

  const decrementQuantity = () => {
    if (formData.quantity > 1) {
      setFormData({ ...formData, quantity: formData.quantity - 1 });
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
  
      return downloadURL; // Devuelve la URL para confirmar la subida
    } catch (error) {
      console.error('error al subir la imagen: ', error);
      throw new error('error al subir la imagen'); // Lanza un error si falla la subida
    }
  };

  const handleSubmit = async() => {
  try {
    // Subir la imagen primero
    const downloadURL = await handleImageUpload(image);
    if (!downloadURL) {
      console.error("error en la subida de la imagen.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    // Verifica si el usuario está autenticado
    if (!user) {
      console.error("Usuario no autenticado.");
      return;
    }

    // Guardar los datos del formulario en Firestore con la URL de la imagen
    await setDoc(doc(db, "offers", new Date().getTime().toString()), {
      ...formData,  // Incluye todos los datos del formulario, incluida la URL de la imagen
      uid: user.uid,
      orderTime: '',
      orderStatus: 'Pendiente',
      foodImage: downloadURL, // Asegúrate de que este campo siempre se guarde correctamente
    });

    console.log("Datos guardados exitosamente en Firestore");
    navigation.navigate('HomeTabs');

  } catch (error) {
    console.error("error al crear nueva orden:", error);
  }
  };

  const validateAlert = () => {
    setIsSubmitEnabled(false);
    const newErrors = {};
    if(formData.productName == ''){
      newErrors.productName = 'Este campo es obligatorio';
    }
    if(formData.normalPrice == ''){
      newErrors.normalPrice = 'Este campo es obligatorio';
    }
    if(formData.offerPrice == ''){
      newErrors.offerPrice = 'Este campo es obligatorio';
    }
    if(!isImageUploaded){
      newErrors.foodImage = 'Este campo es obligatorio';
    }
    setErrorStep(newErrors);
    
    // Si no hay errores, habilitar el botón "Siguiente"
    const hasErrors = Object.keys(newErrors).length > 0;
    setIsSubmitEnabled(!hasErrors);
  }

  return (
  //  <View styles = {styles.contentContainer}>
    <ScrollView style={styles.container}>
      <Text style={styles.label}>
        Producto: <Text style={styles.errorText}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={text => {
          setFormData({ ...formData, productName: text });
        }}
        value={formData.productName}
        placeholder="Ej. Pizza"
      />
      {errorStep ? <Text style={styles.errorText}>{errorStep.productName}</Text> : null}

      <Text style={styles.label}>
        Cantidad: <Text style={styles.errorText}>*</Text>
      </Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.button} onPress={decrementQuantity}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.quantityInput}
          value={String(formData.quantity)}
          editable={false}
        />
        <TouchableOpacity style={styles.button} onPress={incrementQuantity}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Precio de oferta: <Text style={styles.errorText}>*</Text></Text>
      <TextInput
        style={styles.input}
        keyboardType='numeric'
        onChangeText={text => {
          setFormData({ ...formData, offerPrice: text });
        }}
        value={formData.offerPrice}
      />
      {errorStep ? <Text style={styles.errorText}>{errorStep.offerPrice}</Text> : null}
      <Text style={styles.label}>Precio normal: <Text style={styles.errorText}>*</Text></Text>
      <TextInput
        style={styles.input}
        keyboardType='numeric'
        onChangeText={text => {
          setFormData({ ...formData, normalPrice: text });
        }}
        value={formData.normalPrice}
      />
      {errorStep ? <Text style={styles.errorText}>{errorStep.normalPrice}</Text> : null}

        <View style={{marginBottom: 12}}>
        <Text style={styles.label}>Sube una imagen del producto: <Text style = {styles.errorText}>*</Text></Text>
        <Button title="Seleccionar Imagen" onPress={showImagePickerOptions} color={globalStyles.primaryRed.color}/>
            {image && <Image source={{ uri: image }} style={{ width: 370, height: 200, alignSelf: 'center', marginTop: 10}} />}
        </View>
        {errorStep ? <Text style={styles.errorText}>{errorStep.foodImage}</Text> : null}
        <Text style={styles.label}>Notas adicionales: </Text>
      <TextInput
        style={styles.detailsInput}
        multiline = {true}
        numberOfLines={4}
        textAlignVertical="top"  
        onChangeText={text => {
          setFormData({ ...formData, additionalNotes: text });
        }}
        value={formData.additionalNotes}
      />
        <Button title='Crear nueva alerta' color={globalStyles.primaryRed.color} onPress={handleSubmit} disabled={!isSubmitEnabled} ></Button>
    </ScrollView>
  //  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  contentContainer: {
    marginBottom: 30,
  },
  detailsInput:{
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 12,
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
  errorText: {
    color: '#ce0e2d',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ffff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ce0e2d',
    fontSize: 20,
  },
  quantityInput: {
    width: 50,
    height: 40,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 12,
  },
  imageButton: {
    marginVertical: 12,
    color: 'white',
  }
});
