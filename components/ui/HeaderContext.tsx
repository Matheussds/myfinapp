import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ButtonCircle from "./ButtonCircle";

export default function HeaderContext({ onAdd }: { onAdd: () => void }) {
    return (
        <View style={styles.cardHeader}>
            <ButtonCircle backgroundColor='#000' onPressAdd={onAdd} />
            <View style={{ flex: 1, flexDirection: 'row', height: 70, alignItems: "center", justifyContent: 'center', backgroundColor: '#000', borderTopStartRadius: 50, borderBottomStartRadius: 50 }}>
                <TouchableOpacity style={{ flex: 1, alignItems: 'flex-start', paddingStart: 20 }}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, color: '#fff', flex: 1, textAlign: 'center' }}>Geral</Text>
                <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 20 }}>
                    <Ionicons name="chevron-forward" size={24} color="#fff" />
                </TouchableOpacity>
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