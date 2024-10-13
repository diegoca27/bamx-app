import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrderRedeemed = ({ route }) => {
    const { productId, quantity, totalPrice, userId } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Código Reclamado</Text>
            <Text>Product ID: {productId}</Text>
            <Text>Quantity: {quantity}</Text>
            <Text>Total Price: {totalPrice}</Text>
            <Text>User ID: {userId}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default OrderRedeemed;
