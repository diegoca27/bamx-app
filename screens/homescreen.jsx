import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import FoodOrder from '../components/foodorder';

export default function HomeScreen() {
    return (
        <View style = {styles.container}>
        <ScrollView contentContainerStyle = {styles.contentContainer}>
          <FoodOrder 
          foodElement = "Pizza"
          orderState = "En proceso de asignación"
          quantity = "3"
          />
          <FoodOrder 
          foodElement = "Pizza"
          orderState = "En proceso de asignación"
          quantity = "3"
          />
          <FoodOrder 
          foodElement = "Pizza"
          orderState = "En proceso de asignación"
          quantity = "3"
          />
          <FoodOrder 
          foodElement = "Pizza"
          orderState = "En proceso de asignación"
          quantity = "3"
          />
        </ScrollView>
          <TouchableOpacity style = {styles.floatingButton}>
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
      paddingBottom: 80,
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

    }
  })