import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const imageIDs = {
  1: "https://png.pngtree.com/png-clipart/20231019/original/pngtree-pizza-png-with-ai-generated-png-image_13357740.png",
  2: "https://png.pngtree.com/png-clipart/20230928/original/pngtree-burger-png-images-png-image_13164941.png"
};

export default function OrderDetails({ route }) {
  const { foodElement, orderState, quantity, imageID } = route.params;
  const imageSrc = imageIDs[imageID] || "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";

  return (
    <View style={styles.container}>
      <View style = {styles.elementsContainer}>
      <View>
        <Image style={styles.image} source={{ uri: imageSrc }} />
      </View>
      <View style = {styles.textContainer}>
        <Text style={styles.title}>Producto: {foodElement}</Text>
        <Text>Cantidad: {quantity}</Text>
        <Text>Estado de la orden: {orderState}</Text>
      </View>
      </View>
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
    flex: 1,
    paddingBottom: 40,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
