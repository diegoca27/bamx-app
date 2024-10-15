import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon'

const OrderRedeemed = ({ route }) => {
    const { customerName, productId, quantity, totalPrice, userId } = route.params;

    const [showConfetti, setShowConfetti] = useState(true);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Código Reclamado</Text>
            <Text style={styles.info}>Nombre del cliente: {customerName}</Text>
            <Text style={styles.info}>Product ID: {productId}</Text>
            <Text style={styles.info}>Cantidad: {quantity}</Text>
            <Text style={styles.info}>Precio: ${totalPrice}</Text>
            <Text style={styles.info}>User ID: {userId}</Text>

            {showConfetti && (
                <ConfettiCannon
                    count={200}
                    origin={{ x: -10, y: 0 }}
                    fallSpeed={3000}
                    onAnimationEnd={() => setShowConfetti(false)}
                />
            )}
        </View>
    );
};
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f0f0f0', 
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333', 
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center', 
        color: '#555', 
    },
});

export default OrderRedeemed;