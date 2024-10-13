import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import FoodOrder from '../components/foodorder';
import NewOrderScreen from './neworder';
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  const newOrder = () => {
    navigation.navigate('NewOrderScreen')
  }

    return (
        <View style = {styles.container}>
        <ScrollView contentContainerStyle = {styles.contentContainer}>
          <Text style = {styles.pageTitle}>Alertas en curso</Text>
          <FoodOrder 
          foodElement = "Pizza"
          orderState = "Pendiente"
          quantity = "2"
          imageID = "1"
          />
          <FoodOrder 
          foodElement = "Hamburguesa"
          orderState = "Pendiente"
          quantity = "3"
          imageID = "2"
          />
          <FoodOrder 
          foodElement = "Pizza"
          orderState = "Cancelado"
          quantity = "3"
          imageID = "1"
          />
          <FoodOrder 
          foodElement = "Pizza"
          orderState = "Pendiente"
          quantity = "3"
          imageID = "1"
          />
        </ScrollView>
          <TouchableOpacity style = {styles.floatingButton} onPress={newOrder}>
              <Text style = {styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white"
    },
    contentContainer:{
      alignItems: 'center',
      paddingBottom: 60,
    },
    floatingButton:{
      position: 'absolute',
      bottom: 100,
      right: 35,
      backgroundColor: 'red',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      elevation: 5,
      shadowRadius: 4,
    },
    buttonText:{
      color: 'white',
      fontSize: 28,
    },
    pageTitle:{
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
    },
  })