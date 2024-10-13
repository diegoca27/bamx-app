import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js'; // Ajusta la ruta según tu estructura
import { ColorSpace } from 'react-native-reanimated';

const checkToken = async (token, navigation, setMessage) => {
    const docRef = doc(db, "orders", token);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const status = data.orderStatus;

            console.log(docSnap.data())
            console.log(data.orderStatus)

            if (status === "Pending") {
                console.log("Código reclamado.");

                navigation.navigate('OrderRedeemed', {
                    productId: data.productId,
                    quantity: data.quantity,
                    totalPrice: data.totalPrice,
                    userId: data.userId,
                });

                await updateDoc(docRef, {
                    orderStatus: "Usado"
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