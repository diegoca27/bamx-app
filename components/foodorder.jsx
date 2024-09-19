import { StyleSheet, View, Text, Image, ScrollView } from "react-native";
import OrderStateText from "./orderstatetext";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const imageIDs= {
    1 : "https://png.pngtree.com/png-clipart/20231019/original/pngtree-pizza-png-with-ai-generated-png-image_13357740.png",
    2 : "https://png.pngtree.com/png-clipart/20230928/original/pngtree-burger-png-images-png-image_13164941.png"
};

export default function FoodOrder(props){
    const navigation = useNavigation();
    const imageID = imageIDs[props.imageID] || "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png";

    const showDetails = () => {
        navigation.navigate('OrderDetails', { 
          foodElement: props.foodElement, 
          orderState: props.orderState, 
          quantity: props.quantity,
          imageID: props.imageID
        });
      };

    return(
        <TouchableOpacity style = {styles.container} onPress={showDetails}>
        <View style = {styles.container}>
            <Image 
            style = {{
                width: 120,
                height: 120,
                resizeMode: 'contain',
                marginEnd: 30,
            }}
            source = {{uri: imageID}}
            />
            <View style = {styles.textContainer}>
                <Text style = {styles.title}>{props.foodElement}</Text>
                <OrderStateText orderState={props.orderState}/>
                <Text style = {styles.subtitle}>
                    Cantidad: <Text style = {styles.response}>{props.quantity}</Text>
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