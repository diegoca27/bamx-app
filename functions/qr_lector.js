import { db } from '../config/firebaseConfig.js';
import { doc, getDoc, updateDoc } from "firebase/firestore";

async function checkToken(token) {
    const docRef = doc(db, "orders", token);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const status = data.orderStatus; 

            if (status === "Pending") {
                console.log("Código reclamado.");

                await updateDoc(docRef, {
                    orderStatus: "Usado" 
                });

            } else {
                console.log("Este código ya ha sido usado.");
            }
        } else {
            console.log("La orden no existe");
        }
        return 0;
    } catch (error) {
        console.error("Error al buscar la orden:", error);
    } finally {
        process.exit(0); 
    }

}

checkToken("kMFKcI4DdRvzS0D9TM43");