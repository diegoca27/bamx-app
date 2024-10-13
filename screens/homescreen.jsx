import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import FoodOrder from '../components/foodorder';
import NewOrderScreen from './neworder';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'offers'), (snapshot) => { // Suscribirse a cambios en tiempo real
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData); // Actualiza el estado con los datos nuevos
    });

    // Limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, []);

  const newOrder = () => {
    navigation.navigate('NewOrderScreen')
  }

    return (
        <View style = {styles.container}>
        <ScrollView contentContainerStyle = {styles.contentContainer}>
          <Text style = {styles.pageTitle}>Alertas en curso</Text>
          {orders
          .filter(order => order.orderStatus === "En busca de recolector" || order.orderStatus === "Cancelado") // Filtrar por el estado
          .map(order => (
          <FoodOrder 
            key={order.id}
            foodElement={order.productName}
            orderState={order.orderStatus}
            quantity={order.quantity}
            imageURL={order.foodImage}
            price = {order.totalPrice}
          />
        ))}
        </ScrollView>
          <TouchableOpacity style = {styles.floatingButton} onPress={newOrder}>
              <Text style = {styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white"
    },
    contentContainer:{
      alignItems: 'center',
      paddingBottom: 60,
    },
    floatingButton:{
      position: 'absolute',
      bottom: 100,
      right: 35,
      backgroundColor: 'red',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      elevation: 5,
      shadowRadius: 4,
    },
    buttonText:{
      color: 'white',
      fontSize: 28,
    },
    pageTitle:{
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
    },
  })