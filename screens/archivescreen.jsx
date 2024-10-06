import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FoodOrder from '../components/foodorder';
import styles from "../styles.js"

export default function ArchiveScreen() {
    return(
      <View style = {styles.container}>
        <ScrollView contentContainerStyle = {styles.contentContainer}>
        <Text style = {styles.pageTitle}>Historial de alimentos</Text>
          <FoodOrder
            foodElement = "Hamburguesa"
            orderState = "Entregado"
            quantity = "3"
            imageID = "2"
          />
          <FoodOrder
            foodElement = "Pizza"
            orderState = "Entregado"
            quantity = "2"
            imageID = "1"
          />
        </ScrollView>
      </View>
    );
  }