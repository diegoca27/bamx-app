import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import OrderStateText from "./orderstatetext";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function FoodOrder(props){
    const navigation = useNavigation();
    const imageURL = props.imageURL || "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";

    const showDetails = () => {
        navigation.navigate('OrderDetails', { 
          foodElement: props.foodElement, 
          orderState: props.orderState, 
          quantity: props.quantity,
          offerPrice: props.offerPrice,
          normalPrice: props.normalPrice,
          imageURL: props.imageURL,
          additionalNotes: props.additionalNotes
        });
      };

    return(
        <TouchableOpacity style = {styles.container} onPress={showDetails}>
        <View style = {styles.container}>
            <Image 
            style = {{
                width: 150,
                height: 150,
                resizeMode: 'contain',
                marginEnd: 30,
                borderRadius: 30,
            }}
            source = {{uri: imageURL}}
            />
            <View style = {styles.textContainer}>
                <Text style = {styles.title}>{props.foodElement}</Text>
                <OrderStateText orderState={props.orderState}/>
                <Text style = {styles.subtitle}>
                    Cantidad: <Text style = {styles.response}>{props.quantity}</Text>
                </Text>
                <Text style = {styles.subtitle}>
                    Precio normal: $<Text style = {styles.response}>{props.normalPrice}</Text>
                </Text>
                <Text style = {styles.subtitle}>
                    Precio en oferta: $<Text style = {styles.response}>{props.offerPrice}</Text>
                </Text>
            </View>
        </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        borderBottomColor: '#d9d9d9',
        borderBottomWidth: 1,
        height: 200,
        width: 350,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        borderRadius: 10,
        margin: 10,
    },
    textContainer:{
        width: 200,
        flexShrink: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
    },
    response:{
        color: '#61605F'
    },
})