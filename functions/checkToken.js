import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js'; // Ajusta la ruta según tu estructura
import { ColorSpace } from 'react-native-reanimated';

const checkToken = async (token, navigation, setMessage) => {
    const docRef = doc(db, "orders", token);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const status = data.status;

            console.log(docSnap.data())
            console.log(data.status)

            if (status === "Pendiente") {
                console.log("Código reclamado.");

                navigation.navigate('OrderRedeemed', {
                    customerName: data.customerName,
                    productId: data.items[0].productId,
                    quantity: data.items[0].quantity,
                    totalPrice: data.totalAmount,
                    userId: data.customerId,
                });

                await updateDoc(docRef, {
                    status: "Usado"
                });
            } else {
                setMessage("Esta orden ya ha sido reclamada.");
                console.log("Este código ya ha sido usado.");
            }
        } else {
            setMessage("La orden no existe.");
            console.log(token);
            console.log("La orden no existe");
        }
    } catch (error) {
        console.error("Error al buscar la orden:", error);
    }
};

export default checkToken;