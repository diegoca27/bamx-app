import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js'; // Ajusta la ruta según tu estructura
import { ColorSpace } from 'react-native-reanimated';

const checkToken = async (token) => {
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
                await updateDoc(docRef, {
                    orderStatus: "Usado"
                });
            } else {
                console.log("Este código ya ha sido usado.");
            }
        } else {
            console.log(token);
            console.log("La orden no existe");
        }
    } catch (error) {
        console.error("Error al buscar la orden:", error);
    }
};

export default checkToken;