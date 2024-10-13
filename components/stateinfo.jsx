import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Button from '../components/Button';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import QRScanner from '../functions/QRScanner';



export default function StateInfo(props) {
    const navigation = useNavigation();

    if (props.orderState == "Entregado"){
        return(
        <View style={styles.helpContainer}>
            <Text style={styles.alertText}>El producto ya fue entregado</Text>
            <Text style={styles.plainText}>Si ocurrió algún problema, contáctanos.</Text>
            <Button title = "Crear nueva alerta" style= {styles.buttonStyle}/>
        </View>
        );  
    }
    else if (props.orderState == "Pendiente"){
        return (
            <View style={styles.helpContainer}>
                <Text style={styles.alertText}>¡Hemos encontrado un recolector!</Text>
                <Text style={styles.plainText}>Recuerda solicitarle al recolector su boleto y escanearlo en la aplicación</Text>
                <Button
                    title="Escanear código QR"
                    onPress={() => {
                        console.log("navegando a qr scanner");
                        navigation.navigate('QRScanner')}} 
                    style={styles.buttonStyle}
                />
            </View>
        );
    }
    else if(props.orderState == "Cancelado"){
        return(
            <View style={styles.helpContainer}>
                <Text style={styles.alertText}>El pedido fue cancelado</Text>
                <Text style={styles.plainText}>Si ocurrió algún problema, contáctanos.</Text>
                <Button title = "Crear nueva alerta" style= {styles.buttonStyle}/>
            </View>
        );
    }
}