import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import FoodOrder from '../components/foodorder';
import NewOrderScreen from './neworder';
import { collection, onSnapshot, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  
  const checkAndUpdateOfferStatus = async (offerId, currentQuantity) => {
    if (currentQuantity === 0) {
      const offerRef = doc(db, 'offers', offerId); // Referencia al documento de la oferta

      try {
        // Actualiza el estado de la oferta a "Finalizada"
        await updateDoc(offerRef, {
          orderStatus: "Finalizado"
        });
        console.log(`La oferta ${offerId} ha sido finalizada.`);
      } catch (error) {
        console.error("Error al actualizar la oferta: ", error);
      }
    }
  };

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const restaurantUid = user.uid; // Obtener el UID del usuario autenticado (restaurante)

      // Filtrar por UID del restaurante
      const ordersQuery = query(
        collection(db, 'offers'),
        where('uid', '==', restaurantUid) // Filtrar por UID del restaurante
      );

      const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
        const ordersData = snapshot.docs.map(doc => {
          const order = {
            id: doc.id,
            ...doc.data(),
          };
          
          // Revisar si la cantidad es 0 y actualizar el estado
          checkAndUpdateOfferStatus(order.id, order.quantity);
          
          return order;
        });
        setOrders(ordersData); // Actualiza el estado con los datos nuevos
      });

      // Limpiar el listener al desmontar el componente
      return () => unsubscribe();
    }
  }, []);

  const newOrder = () => {
    navigation.navigate('NewOrderScreen')
  }

    return (
        <View style = {styles.container}>
        <ScrollView contentContainerStyle = {styles.contentContainer}>
          <Text style = {styles.pageTitle}>Alertas en curso</Text>
          {orders
          .filter(order => order.orderStatus === "Pendiente" || order.orderStatus === "Cancelado") // Filtrar por el estado
          .map(order => (
          <FoodOrder 
            key={order.id}
            foodElement={order.productName}
            orderState={order.orderStatus}
            quantity={order.quantity}
            imageURL={order.foodImage}
            offerPrice = {order.offerPrice}
            normalPrice = {order.normalPrice}
            additionalNotes = {order.additionalNotes}
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