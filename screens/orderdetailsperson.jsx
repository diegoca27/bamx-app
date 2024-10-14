import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Animated, StyleSheet } from 'react-native';


const orders = [
  {
    id: '1',
    restaurant: 'La Gran Lucha',
    date: '12 de octubre de 2024, 17:20 h',
    price: '$65 MXN',
    items: [
      { name: 'Hamburguesa', price: '$25.00', quantity: 2 },
      { name: 'Papas fritas', price: '$10.00', quantity: 1 },
      { name: 'Fanta', price: '$5.00', quantity: 2 },
    ],
    delivered: true,
  },
  {
    id: '2',
    restaurant: 'Dominos Pizza',
    date: '11 de octubre de 2024, 13:22 h',
    price: '$10.04',
    items: [],
    delivered: false,
  },
  {
    id: '3',
    restaurant: 'Chilaquiles TEC',
    date: 'May 30 at 11:15 am',
    price: '$14.15',
    items: [],
    delivered: false,
  },
  // Agrega más pedidos según sea necesario
];

const OrderDetailsPerson = () => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [animation, setAnimation] = useState(new Animated.Value(0));

  const toggleOrder = (id) => {
    if (expandedOrderId === id) {
      // Colapsar
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpandedOrderId(null));
    } else {
      // Expandir
      setExpandedOrderId(id);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const renderOrder = ({ item }) => {
    const isExpanded = expandedOrderId === item.id;
    const animationStyle = {
      height: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 150], // Ajusta la altura expandida
      }),
      opacity: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    };

    return (
      <View style={styles.orderContainer}>
        <TouchableOpacity onPress={() => toggleOrder(item.id)}>
          <View style={styles.orderHeader}>
            <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.image} />
            <View style={styles.orderInfo}>
              <Text style={styles.restaurantName}>{item.restaurant}</Text>
              <Text style={styles.orderDate}>{item.date}</Text>
            </View>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <Animated.View style={[styles.expandedSection, animationStyle]}>
            <Text style={styles.status}>Order Delivered</Text>
            <FlatList
              data={item.items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                </View>
              )}
            />
            <TouchableOpacity style={styles.reorderButton}>
              <Text style={styles.reorderText}>Reorder</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  orderContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10, 
    marginHorizontal: 5,
    padding: 10,

    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Sombra para Android
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  orderInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4D4D',
  },
  expandedSection: {
    marginTop: 10,
  },
  status: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
  },
  reorderButton: {
    marginTop: 10,
    backgroundColor: '#FF4D4D',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  reorderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OrderDetailsPerson;
