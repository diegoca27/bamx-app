import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import NavBar from './components/navbar';
import HomeScreen from './screens/homescreen';
import ArchiveScreen from './screens/archivescreen';
import ProfileScreen from './screens/profilescreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer style = {styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Inicio') {
              iconName = 'home-outline';
            } else if (route.name === 'Historial') {
              iconName = 'archive-outline';
            } else if (route.name === 'Perfil') {
              iconName = 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />
             
          },
          tabBarStyle: {
            marginVertical: 5,
            backgroundColor: '#fff',
            position: 'absolute', 
            marginBottom: 0,
            width: '100%',
            height: "6%",
          },  
          tabBarLabelStyle:{
            paddingBottom: 5,
          },
          tabBarActiveTintColor: "red",
        })}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Historial" component={ArchiveScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
