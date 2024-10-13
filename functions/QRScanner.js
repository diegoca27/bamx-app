import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import checkToken from './checkToken';
import { useNavigation } from '@react-navigation/native';

export default function QRScanner() {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [cameraRef, setCameraRef] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            console.log("Permiso de cámara:", status); 
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        console.log("llegue a qr scanner"); 
    }, []);

    const handleBarCodeScanned = async (scanningResult) => {
        console.log("empezar a scanear");
    
    // Hacer un log de todo el objeto que contiene la información del escaneo
        console.log("Resultado completo del escaneo:", scanningResult);
    
        const { type, data } = scanningResult;
        if (scanned) return; 
        setScanned(true); 
        console.log(`QR code with data ${data} has been scanned!`);

        try {
            console.log(data);
            await checkToken(data, navigation, setMessage);
        } catch (error) {
            console.error("Error al verificar el token:", error);
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Botón personalizado para volver */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Atrás</Text>
            </TouchableOpacity>
            <BarCodeScanner
                style={StyleSheet.absoluteFillObject}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                
                <View style={styles.overlay}>
                    
                    {scanned && (
                        <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
                            <Text style={styles.buttonText}>Escanear</Text>
                        </TouchableOpacity>
                    )}
                    {message ? (
                        <View style={styles.messageContainer}>
                            <Text style={styles.messageText}>{message}</Text>
                        </View>
                    ) : null}
                </View>
            </BarCodeScanner>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        paddingBottom: 65, 
    },
    button: {
        backgroundColor: 'red', 
        borderRadius: 5, 
        padding: 10, 
        width: '60%', 
        alignItems: 'center', 
        alignSelf: 'center', 
        marginTop: 40,
    },
    buttonText: {
        color: 'white', 
        fontSize: 16,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        paddingVertical: 10,
        paddingHorizontal: 20, 
        backgroundColor: 'red', 
        borderRadius: 5,
        zIndex: 10,
    },
    backButtonText: {
        color: 'white', 
        fontSize: 16,
        textAlign: 'center', 
    },
    message: {
        marginTop: 20,
        color: 'black',
        fontSize: 18,
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', 
        width: '100%',
        height: '100%',
    },
    messageText: {
        fontSize: 24, 
        color: 'white', 
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        padding: 10, 
    },
});
