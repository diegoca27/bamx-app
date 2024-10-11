import React, { createContext, useState, useEffect } from 'react';
import { auth, firestore } from '../config/firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);  // Comenzar el estado de carga
      if (firebaseUser) {
        // Intentar cargar desde "users"
        const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setUserType(userData.userType);
        } else {
          // Si no existe en "users", intentar cargar desde "companies"
          const companyDoc = await getDoc(doc(firestore, 'companies', firebaseUser.uid));
          if (companyDoc.exists()) {
            const companyData = companyDoc.data();
            setUser(companyData);
            setUserType(companyData.userType);
          } else {
            setAuthError('Usuario no encontrado en ninguna colección.');
          }
        }
      } else {
        // Si no hay un usuario autenticado
        setUser(null);
        setUserType(null);
      }
      setIsLoading(false);  // Finalizar el estado de carga
    });
  
    return () => unsubscribe();
  }, []);
  
  
  

  return (
    <UserContext.Provider value={{ user, userType, setUser, setUserType, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
