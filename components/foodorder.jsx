import { StyleSheet, View, Text, Image } from "react-native";

export default function FoodOrder(props){
    return(
        <View style = {styles.container}>
            <Image 
            style = {{
                width: 150,
                height: 150,
                resizeMode: 'contain',
            }}
            source ={require( '../assets/pizza.png')}
            />
            <View style = {styles.textContainer}>
                <Text style = {styles.title}>{props.foodElement}</Text>
                <Text style = {styles.subtitle}>
                    Estado: <Text style = {styles.response}>{props.orderState}</Text>
                </Text>
                <Text style = {styles.subtitle}>
                    Cantidad: <Text style = {styles.response}>{props.quantity}</Text>
                </Text>
            </View>
        </View>
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
    }
})