import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Para manejar carga inicial

  // Función para obtener el usuario de AsyncStorage
  const getUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al cargar usuario desde AsyncStorage:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  // Al iniciar la aplicación, intenta cargar al usuario
  useEffect(() => {
    getUserFromStorage();
  }, []);

  // Función para guardar el usuario en AsyncStorage
  const saveUserToStorage = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Error al guardar usuario en AsyncStorage:", error);
    }
  };

  // Cuando 'user' cambie, guárdalo en AsyncStorage
  useEffect(() => {
    if (user) {
      saveUserToStorage(user);
    }
  }, [user]); 

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}> 
      {children}
    </UserContext.Provider>
  );
};