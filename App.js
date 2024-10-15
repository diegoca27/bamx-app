import React, { useContext } from 'react';
import { StyleSheet, View, useWindowDimensions, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Importar pantallas
import HomeScreen from './screens/homescreen';
import HomeScreenPerson from './screens/homescreenperson';
import ArchiveScreen from './screens/archivescreen';
import ProfileScreen from './screens/profilescreen';
import LoginScreen from './screens/loginscreen';
import RegisterScreen from './screens/registerscreen';
import NewCompany from './screens/registerscreen/newcompany';
import NewPerson from './screens/registerscreen/newperson';
import MultiStepForm from './components/MultiStepForm';
import { UserProvider, UserContext } from './context/UserContext';
import globalStyles from './styles/global';
import OrderDetails from './screens/orderdetails';
import OrderDetailsPerson from './screens/orderdetailsperson';
import InstructionsScreen from './screens/instructionscreen';
import QRScanner from './functions/QRScanner';
import NewOrderScreen from './screens/neworder';
import OrderRedeemed from './functions/OrderRedeemed';

LogBox.ignoreLogs([
  'Warning: Main: Support for defaultProps will be removed',
  'Warning: CountryPicker: Support for defaultProps will be removed',
  'Warning: FlagButton: Support for defaultProps will be removed',
  'Warning: Flag: Support for defaultProps will be removed',
  'Warning: CountryModal: Support for defaultProps will be removed'
]);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CompanyHome() {
  const { height } = useWindowDimensions();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => <LogoTitle />,
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


function PersonHome() {
  const { height } = useWindowDimensions();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => <LogoTitle />,
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
      <Tab.Screen name="Inicio" component={HomeScreenPerson} options={{ headerShown: false}} />
      <Tab.Screen name="Historial" component={OrderDetailsPerson} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function LogoTitle() {
  return (
    <Image
      style={{ width: 80, height: 50 }}
      source={require('./assets/logoBAMX.png')}
    />
  );
}

function HomeTabs() {
  const { user, userType, isLoading } = useContext(UserContext);

  console.log("HomeTabs - User:", user); // <-- Aquí
  console.log("HomeTabs - UserType:", userType); // <-- Aquí

  // if (isLoading) {
  //   return <LoadingScreen />; 
  // }

  if (userType === 'persona') {
    return <PersonHome />;
  } else if (userType === 'empresa') {
    return <CompanyHome />; 
  } else {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
}


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

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
              component={NewPerson}
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
              component={NewCompany}
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
              options={{
                title: 'Detalles de alerta',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
              }}
            />
             <Stack.Screen 
             name="NewOrderScreen" 
             component={NewOrderScreen}
              options = {{
                title: 'Nueva alerta',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
              }}
             />
            <Stack.Screen name="Instructions"
              component={InstructionsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="QRScanner" 
            component={QRScanner}
            options={{ headerShown: false }}
            />
            <Stack.Screen name="OrderRedeemed" 
            component={OrderRedeemed} 
            options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});