import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    contentContainer:{
        alignItems: 'center',
        paddingBottom: 80,
      },
      pageTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
      },
      delivered:{
        fontSize: 16,
        color: "green",
    },
    pending: {
        fontSize: 16,
        color: "orange",
    },
    cancelled: {
        fontSize: 16,
        color: "red",
    },
    alertText:{
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
      },
      plainText:{
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 20,
      },
      buttonStyle:{
        marginTop: 20,
        backgroundColor: 'red',
      },
      helpContainer:{
        paddingBottom: 10,
        alignItems: 'center',
        width: 300,
      },
})

export default styles;