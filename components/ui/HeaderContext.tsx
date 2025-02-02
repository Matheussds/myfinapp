import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function HeaderContext() {
    return (
        <View style={styles.cardHeader}>
            <View style={{ backgroundColor: '#000', borderRadius: '100%', padding: 14 }}>
                <Ionicons name="add" size={40} color='#fff' />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', height: 70, alignItems: "center", justifyContent: 'center', backgroundColor: '#000', borderTopStartRadius: 50, borderBottomStartRadius: 50 }}>
                <View style={{ flex: 1, alignItems: 'flex-start', paddingStart: 20 }}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </View>
                <Text style={{ fontSize: 18, color: '#fff', flex: 1, textAlign: 'center' }}>Geral</Text>
                <View style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 20 }}>
                    <Ionicons name="chevron-forward" size={24} color="#fff" />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardHeader: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingStart: 8
    },
})