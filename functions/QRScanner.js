import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import checkToken from './checkToken';

export default function QRScanner() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [cameraRef, setCameraRef] = useState(null);

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
            await checkToken(data);
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
            <BarCodeScanner
                style={StyleSheet.absoluteFillObject}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                
                <View style={styles.overlay}>
                    
                    {scanned && (
                        <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
                            <Text style={styles.buttonText}>Tap to Scan Again</Text>
                        </TouchableOpacity>
                    )}
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
    }
});
