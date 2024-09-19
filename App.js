import React from 'react';
import { StyleSheet, View, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { LogBox } from 'react-native';

// Importar pantallas
import HomeScreen from './screens/homescreen';
import ArchiveScreen from './screens/archivescreen';
import ProfileScreen from './screens/profilescreen';
import LoginScreen from './screens/loginscreen';
import RegisterScreen from './screens/registerscreen';
import RegisterPersonScreen from './screens/registerscreen/registerpersonscreen';
import RegisterCompanyScreen from './screens/registerscreen/registercompanyscreen';
import MultiStepForm from './components/MultiStepForm';
import { UserProvider } from './context/UserContext';
import globalStyles from './styles/global';
import OrderDetails from './screens/orderdetails';

LogBox.ignoreLogs([
  'Warning: Main: Support for defaultProps will be removed',
  'Warning: CountryPicker: Support for defaultProps will be removed',
  'Warning: FlagButton: Support for defaultProps will be removed',
  'Warning: Flag: Support for defaultProps will be removed',
  'Warning: CountryModal: Support for defaultProps will be removed'
]);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  const { height } = useWindowDimensions();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => <LogoTitle/>,
        headerTitleAlign: 'center',
        headerStyle: {
        backgroundColor: '#ffff',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home-outline';
          } else if (route.name === 'Historial') {
            iconName = 'archive-outline';
          } else if (route.name === 'Perfil') {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          position: 'absolute',
          paddingTop: 7,
          marginBottom: 0,
          width: '100%',
          height: height * .090,
        },
        tabBarLabelStyle: {
          paddingBottom: 5,
        },
        tabBarActiveTintColor: "red",
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Historial" component={ArchiveScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function LogoTitle(){
  return(
    <Image
    style = {{ width: 80, height: 50}}
    source = {require('./assets/logoBAMX.png')}
    />
  );
}

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={({ navigation }) => ({
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 0 }}>
                  <Ionicons name="chevron-back" size={24} color={globalStyles.backButton.tintColor} />
                </TouchableOpacity>
              ),
              headerTitle: '', // Elimina el título para que solo se vea la flecha
              headerStyle: {
                backgroundColor: 'white',
              },
              headerShadowVisible: false,
            })}
          />
          <Stack.Screen name="RegisterPerson"
            component={RegisterPersonScreen}
            options={({ navigation }) => ({
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 0 }}>
                  <Ionicons name="chevron-back" size={24} color={globalStyles.backButton.tintColor} />
                </TouchableOpacity>
              ),
              headerTitle: '', // Elimina el título para que solo se vea la flecha
              headerStyle: {
                backgroundColor: 'white',
              },
              headerShadowVisible: false,
            })}
          />
          <Stack.Screen name="RegisterCompany"
            component={RegisterCompanyScreen}
            options={({ navigation }) => ({
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 0 }}>
                  <Ionicons name="chevron-back" size={24} color={globalStyles.backButton.tintColor} />
                </TouchableOpacity>
              ),
              headerTitle: '', // Elimina el título para que solo se vea la flecha
              headerStyle: {
                backgroundColor: 'white',
              },
              headerShadowVisible: false,
            })}
          />
          <Stack.Screen name="MultiStepForm" component={MultiStepForm} />
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
        <Stack.Screen 
          name="OrderDetails" 
          component={OrderDetails} 
          options={{ title: 'Detalles de alerta', 
            headerTitleAlign: 'center',
            headerShadowVisible: false,
          }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});