import { StyleSheet, Text, View } from "react-native";
import ButtonCircle from "./ButtonCircle";

export default function FooterContext() {
    const colorBlue = '#052BC2';
    
    return (
        <View style={styles.container}>
            <View style={{ height: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', flex: 1, borderTopRightRadius: 100, borderBottomRightRadius: 100, padding: 4, paddingHorizontal: 12 }}>
                <Text style={{ fontSize: 20 }}>Total</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 14 }}>R$</Text>
                    <Text style={{ fontSize: 30, color: colorBlue, textAlign: 'right' }}>100</Text>
                </View>
            </View>

            <ButtonCircle backgroundColor={colorBlue} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        gap: 8,
        paddingEnd: 8
    }
});