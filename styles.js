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
})

export default styles;