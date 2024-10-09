import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, SafeAreaView, ScrollView, Linking } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon'

const InstructionsScreen = ({ route, navigation }) => {
  const [token, setToken] = useState(null);

  const [showConfetti, setShowConfetti] = useState(true);
  const confettiRef = useRef(null);


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
    // 1. Obtener orderData de los parámetros de navegación
    const { orderData } = route.params;

    // 2. Generar el token del orderData
    const newToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setToken(newToken);
    console.log(newToken);

    // 3. Guardar orderData en la base de datos
    // ... tu lógica para guardar orderData en la base de datos ...
  }, [route.params]);

  const openGps = () => {
    const address = 'Avenida Hidalgo 34, Zapopan, Jalisco'; // La dirección que quieres abrir
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

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
          <Ionicons name="chevron-back" size={24} color={'white'}/>
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
            <Text style={styles.scanText}>Escanea este código en el restaurante para hacer entrega de tu pedido.</Text>
          </View>
        )}
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Resumen del pedido</Text>
          <View style={styles.divider} />
          {/* Aquí puedes iterar sobre orderData para mostrar los detalles del pedido */}
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Pedido</Text>
            <Text style={styles.itemValue}>No. 458768945</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Producto</Text>
            <Text style={styles.itemValue}>Hamburguesa con papas</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.itemLabel}>Establecimiento</Text>
            <Text style={styles.itemValue}>Burger King</Text>
          </View>
            <View style={styles.summaryItem}>
              <Text style={styles.itemLabel}>Recoger en</Text>
              <TouchableOpacity style={styles.itemValue} onPress={openGps}> 
                <Text>Avenida Hidalgo 34, Zapopan, Jalisco</Text>
              </TouchableOpacity>
            </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.totalValue}>Total</Text>
            <Text style={styles.totalValue}>$350 MXN</Text>
          </View>
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