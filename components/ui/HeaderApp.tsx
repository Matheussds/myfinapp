import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export default function HeaderApp() {
    return (
        <View style={styles.headerContainer}>
            <LinearGradient colors={['#02145C', '#052BC2']} style={styles.gradientContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', height: 30 }}>
                    <Ionicons name="ellipsis-horizontal" size={50} color="#fff" />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, paddingBottom: 4 }}>
                    <View style={{ paddingStart: 40 }}>
                        <Text style={{ color: '#fff' }}>M 2.000,00</Text>
                        <Text style={{ color: '#fff' }}>D 100,00</Text>
                    </View>
                    <Text style={{ color: '#fff', fontSize: 24 }}>R$ 50.000,00</Text>
                </View>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        borderBottomLeftRadius: 50
    },
    gradientContainer: {
        height: 80,
        width: '100%',
        paddingHorizontal: 8,
        borderBottomLeftRadius: 50
    },
})