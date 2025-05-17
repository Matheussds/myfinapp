import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect } from "react";
import useErrorStore from "store/errorStore";

export default function ErrorView() {
    const { error } = useErrorStore();

    useEffect(() => {
        console.log("View Erro renderizada.")
    }, [error])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FontAwesome name="warning" size={80} color="#052BC2" />
                <Text style={{ textAlign: 'center' }}>Desculpe, foi detectado um erro de conexão. Por favor,verfique a rede do seu dispositivo ou entre em contato com a equipe MyFin.</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})