import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FoodOrder from '../components/foodorder';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import styles from "../styles.js"

export default function ArchiveScreen() {
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
  
    return(
      <View style = {styles.container}>
        <ScrollView contentContainerStyle = {styles.contentContainer}>
        <Text style = {styles.pageTitle}>Historial de alimentos</Text>
        {orders
          .filter(order => order.orderStatus === "Entregado") // Filtrar por el estado
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
      </View>
    );
  }