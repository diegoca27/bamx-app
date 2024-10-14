import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, SafeAreaView, ScrollView, Linking } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon'
import { firestore } from '../config/firebaseConfig';
import { UserContext } from '../context/UserContext';
import { doc, setDoc, getDoc, runTransaction, collection, updateDoc } from 'firebase/firestore';

const InstructionsScreen = ({ route, navigation }) => {
  const [token, setToken] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const confettiRef = useRef(null);
  const { user } = useContext(UserContext);
  const [companyAddress, setCompanyAddress] = useState('');
  const [orderData, setOrderData] = useState(null);
  const initialOrderData = route.params?.orderData;
  const [mergedData, setMergedData] = useState(null);


  useEffect(() => {
    // Disparar el confeti después de que el componente se haya montado
    if (showConfetti) {
      confettiRef.current.start();
    }

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    // Limpiar el setTimeout al desmontar el componente
    return () => clearTimeout(timer);
  }, [showConfetti]);


  useEffect(() => {
    // Log para verificar los parámetros que llegan
    console.log('Parámetros de la ruta:', route.params);
    const fetchAndSaveOrder = async () => {
      try {
        // Verificar si route.params está correctamente definido
        if (!route.params || !route.params.offerId) {
          throw new Error("Los parámetros de la ruta no contienen un offerId válido.");
        }

        const { offerId } = route.params;
          console.log("Obteniendo oferta con offerId:", offerId);
  
        // 1. Obtener los datos de la oferta
        const offerRef = doc(firestore, 'offers', offerId);
        const offerSnapshot = await getDoc(offerRef);
  
        // Verificar si se encontró la oferta
        if (!offerSnapshot.exists()) {
          throw new Error(`No se encontró la oferta con el ID: ${offerId}`);
        }
  
        const offerData = {
          id: offerSnapshot.id, // Asignar explícitamente el ID
          ...offerSnapshot.data(),
        };
        console.log('Oferta obtenida:', offerData);
  
        // Verificar si el offerData tiene el uid para buscar la compañía
        if (!offerData.uid) {
          throw new Error("La oferta no contiene un 'uid' válido para buscar la compañía.");
        }
  
        // 2. Obtener los datos de la compañía relacionada a la oferta
        const companyId = offerData.uid;
        console.log("Obteniendo compañía con uid:", companyId);
        
        const companyRef = doc(firestore, 'company', companyId);
        const companySnapshot = await getDoc(companyRef);
  
        // Verificar si se encontró la compañía
        if (!companySnapshot.exists()) {
          throw new Error(`No se encontró la compañía con el UID: ${companyId}`);
        }
  
        const companyData = companySnapshot.data();
        console.log('Compañía obtenida:', companyData);
  
        // 3. Hacer el merge de la oferta con los datos de la compañía
        const mergedData = {
          ...offerData,
          company: companyData,
        };

        setMergedData(mergedData);

        console.log('Datos combinados (mergedData):', mergedData);
  
        // 4. Guardar la orden en la base de datos
        const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // Crear token QR
        setToken(newToken);
        const orderRef = doc(firestore, 'orders', newToken);

        if (!initialOrderData) {
          throw new Error("No se proporcionron datos de la orden (initialOrderData) en los parámetros.");
        }
  
        await setDoc(orderRef, {
          orderId : newToken,
          customerId: initialOrderData.customer.id || null, // ID del cliente (si está disponible)
          customerName: initialOrderData.customer.name, // Nombre del cliente
          customerEmail: initialOrderData.customer.email, // Email del cliente
          items: initialOrderData.items, // Array de los productos pedidos
          totalAmount: initialOrderData.totalAmount, // Total de la orden
          paymentMethod: initialOrderData.paymentMethod, // Método de pago
          status: initialOrderData.status, // Estado de la orden
          orderDate: new Date(), // Fecha actual
          orderTime: initialOrderData.time, // Hora de la orden
          offerId: offerData.id, // ID de la oferta
          restaurantId: companyData.uid, // ID del restaurante
          restaurantName: companyData.companyName, // Nombre del restaurante
          restaurantAddress: companyData.address, // Dirección del restaurante
          qrCode: newToken, // Código QR generado
        });

        // 5. Actualizar el valor de `quantity` en la oferta
        const orderedQuantity = initialOrderData.items.reduce((total, item) => total + item.quantity, 0); // Sumar las cantidades pedidas
        const newQuantity = (offerData.quantity || 0) - orderedQuantity; // Restar la cantidad pedida del stock actual

        // Verificar si hay suficiente stock antes de continuar
        if (newQuantity < 0) {
          throw new Error("No hay suficiente stock disponible para cumplir con esta orden.");
        }

        // Actualizar el campo `quantity` en el documento de la oferta
        await updateDoc(offerRef, {
          quantity: newQuantity,
        });

        
        console.log('Cantidad actualizada en la oferta:', newQuantity);
        
        console.log("Orden guardada correctamente.");

      } catch (error) {
        console.error('Error al obtener la oferta o la compañía:', error);
      }
    };
  
    if (route.params) {
      fetchAndSaveOrder();
    }
  }, [route.params]);
  


  const openGps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyAddress)}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("No se pudo abrir la URL:", url);
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={'white'} />
        </TouchableOpacity>
      </View>
  
      <ScrollView style={styles.content} contentInset={{ bottom: 60 }}>
        {/* Confeti */}
        {showConfetti && (
          <ConfettiCannon
            count={200}
            origin={{ x: -50, y: 0 }}
            fallSpeed={1000}
            ref={confettiRef}
          />
        )}
        <Text style={styles.confirmationText}>¡Orden confirmada!</Text>
        {token && (
          <View style={styles.qrCodeContainer}>
            <QRCode
              value={token}
              size={230}
            />
            <Text style={styles.scanText}>
              Escanea este código en el restaurante para hacer entrega de tu pedido.
            </Text>
          </View>
        )}
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Resumen del pedido</Text>
          <View style={styles.divider} />
  
          {/* Mostrar datos del pedido si orderData está disponible */}
          {/* Mostrar mensaje de carga mientras los datos no estén listos */}
          {(!mergedData || !initialOrderData) ? (
            <Text>Cargando datos del pedido...</Text>
          ) : (
            <>
            <View style={styles.summaryItem}>
              <Text style={styles.itemLabel}>Cliente</Text>
              <Text style={styles.itemValue}>{initialOrderData.customer.name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.itemLabel}>Pedido</Text>
              <Text style={styles.itemValue}>No. {mergedData.id}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.itemLabel}>Cantidad</Text>
              <Text style={styles.itemValue}>{initialOrderData.quantity}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.itemLabel}>Establecimiento</Text>
              <Text style={styles.itemValue}>{mergedData.company.companyName}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.itemLabel}>Recoger en</Text>
              <TouchableOpacity style={styles.itemValue} onPress={openGps}> 
                <Text>{mergedData.company.address}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text style={styles.totalValue}>Total</Text>
              <Text style={styles.totalValue}>${initialOrderData.totalAmount} MXN</Text>
            </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ce0e2d',
  },
  header: {
    height: 100,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  backButton: {
    top: 20,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',

  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  confirmationText: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 30,
  },
  qrCodeContainer: {
    alignItems: 'center',
  },
  scanText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    marginRight: 50,
    marginLeft: 50,
  },
  orderSummary: {
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  itemValue: {
    fontSize: 14,
    textAlign: 'left',
    flex: 1,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'justify',
    paddingHorizontal: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
});

export default InstructionsScreen;