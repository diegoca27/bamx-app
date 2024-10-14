import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Button from '../components/Button';
import OrderStateText from '../components/orderstatetext';
import StateInfo from "../components/stateinfo";

export default function OrderDetails({ route }) {
  const { foodElement, orderState, offerPrice, normalPrice, quantity, imageURL, additionalNotes } = route.params;
  const imageSrc = imageURL || "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";

  return (
    <View style={styles.container}>
      <View style = {styles.elementsContainer}>
      <View>
        <Image style={styles.image} source={{ uri: imageSrc }} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textstyle}>
          <Text style= {{fontWeight: 'bold'}}>Producto: </Text>{foodElement}
        </Text>
        <Text style={styles.textstyle}>
          <Text style= {{fontWeight: 'bold'}}>Cantidad restante: </Text>{quantity}
        </Text>
        <Text style={styles.textstyle}>
            <Text style={styles.textStyle1}>Precio normal: </Text>
            <Text style={styles.normalPrice}>${normalPrice}</Text>
          </Text>
        <Text style={styles.textstyle}>
          <Text style= {{fontWeight: 'bold'}}>Precio de oferta: </Text>${offerPrice}
        </Text>
        <OrderStateText orderState={orderState}/>
      </View>
      </View>
      <View style= {styles.notesContainer}>
        <Text style={styles.textStyle1}>Notas adicionales para la recolección</Text>
        <Text style = {styles.notesText}>{additionalNotes}</Text>
      </View>
      <StateInfo orderState ={orderState}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  notesText:{
    padding: 10,
    width: 370,
    fontSize: 16,
    textAlign: 'center'
  },
  notesContainer:{
    alignItems: 'center',
    marginVertical: 20,
  },
  elementsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  textstyle: {
    paddingBottom: 10,
    fontSize: 16,
  },
  textStyle1:{
    paddingBottom: 10,
    fontSize: 16,
    textDecorationLine: 'none',
    fontWeight: 'bold',
  },
  textContainer: {
    flexShrink: 1,
    marginLeft: 30,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 20,
  },
  normalPrice:{
    textDecorationLine: 'line-through',
    paddingBottom: 10,
    fontSize: 16,
    color: 'grey',
  },
});
