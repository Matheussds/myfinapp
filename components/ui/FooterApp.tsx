import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function FooterApp() {
    const colorBlue = '#052BC2';

    return (
        <View style={styles.footerContainer}>

            <View style={{ flex: 1, alignItems: 'flex-start', paddingStart: 20 }}>
                <Ionicons name="chevron-back" size={40} color={colorBlue} />
            </View>
            <Text style={{ fontSize: 18, color: '#000', flex: 1, textAlign: 'center' }}>JAN/2025</Text>
            <View style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 20 }}>
                <Ionicons name="chevron-forward" size={40} color={colorBlue} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 80,
        width: '100%',
        backgroundColor: '#fff',
        borderTopRightRadius: 50
    },
})