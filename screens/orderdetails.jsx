import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Button from '../components/Button';
import OrderStateText from '../components/orderstatetext';
import StateInfo from "../components/stateinfo";

export default function OrderDetails({ route }) {
  const { foodElement, orderState, quantity, imageURL } = route.params;
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
          <Text style= {{fontWeight: 'bold'}}>Cantidad: </Text>{quantity}
        </Text>
        <OrderStateText orderState={orderState}/>
      </View>
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
  elementsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  textstyle: {
    paddingBottom: 10,
    fontSize: 16,
  },
  textContainer: {
    marginTop: 30,
    flexShrink: 1,
    marginLeft: 30,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 20,
  },
});
