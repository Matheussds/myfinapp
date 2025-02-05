import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ButtonCircle from "./ButtonCircle";
import { Fragment, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function FooterContext({ onAdd }: { onAdd: (paymentMethod: 'Card' | 'Money') => void }) {
    const [openPaymentMethod, setOpenPaymentMethod] = useState(false);

    const colorBlue = '#052BC2';

    return (
        <View style={styles.container}>
            <View style={{ height: 68, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', flex: 1, borderTopRightRadius: 100, borderBottomRightRadius: 100, padding: 4, paddingHorizontal: 12 }}>
                {!openPaymentMethod ?
                    <Fragment>
                        <Text style={{ fontSize: 20 }}>Total</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ fontSize: 14 }}>R$</Text>
                            <Text style={{ fontSize: 30, color: colorBlue, textAlign: 'right' }}>100</Text>
                        </View>
                    </Fragment>
                    :
                    <Fragment>
                        <TouchableOpacity style={{ height: '100%', justifyContent: "center", width: '50%' }} onPress={() => onAdd('Card')}>
                            <Text style={{ textAlign: "center" }}>Cartão</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: '100%', justifyContent: "center", width: '50%' }} onPress={() => onAdd('Money')}>
                            <Text style={{ textAlign: "center" }}>Dinheiro</Text>
                        </TouchableOpacity>
                    </Fragment>
                    // <View style={{ flexDirection: 'row', gap: 8, backgroundColor: '#fff', padding: 4, paddingHorizontal: 12, borderRadius: 100 }}>

                    // </View>
                }
            </View>
            <ButtonCircle backgroundColor={!openPaymentMethod ? colorBlue : '#db0c0c'} onPressAdd={() => setOpenPaymentMethod(!openPaymentMethod)}>
                {openPaymentMethod && <Ionicons name="close" size={40} color="#fff" />}
            </ButtonCircle>
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