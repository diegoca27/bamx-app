import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FoodOrder from '../components/foodorder';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import styles from "../styles.js"

export default function ArchiveScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const restaurantUid = user.uid; // Obtener el UID del usuario autenticado (restaurante)

      // Filtrar por UID del restaurante y ordenar por fecha (si `createdAt` es un campo de fecha)
      const ordersQuery = query(
        collection(db, 'offers'),
        where('uid', '==', restaurantUid) // Filtrar por UID del restaurante
      );

      const unsubscribe = onSnapshot(ordersQuery, (snapshot) => { // Suscribirse a cambios en tiempo real
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData); // Actualiza el estado con los datos nuevos
      });

      // Limpiar el listener al desmontar el componente
      return () => unsubscribe();
    }
  }, []);
  
    return(
      <View style = {styles.container}>
        <ScrollView contentContainerStyle = {styles.contentContainer}>
        <Text style = {styles.pageTitle}>Historial de alimentos</Text>
        {orders
          .filter(order => order.orderStatus === "Finalizado") // Filtrar por el estado
          .map(order => (
          <FoodOrder 
            key={order.id}
            foodElement={order.productName}
            orderState={order.orderStatus}
            quantity={order.quantity}
            imageURL={order.foodImage}
            normalPrice = {order.normalPrice}
            offerPrice = {order.offerPrice}
          />
        ))}
        </ScrollView>
      </View>
    );
  }