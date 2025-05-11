import { StyleSheet, Text, View } from "react-native";
import ButtonCircle from "@ui/ButtonCircle"; // Adjusted the path to match the correct location
import { useState } from "react";
import { PaymentMethod } from "entity";
import ModalMethod from "../modals/ModalPaymentMethod";

interface Props {
    onMethodSelected: (paymentMethod: PaymentMethod) => void;
    totalAmount: number;
}

export default function FooterContext({ onMethodSelected, totalAmount }: Props) {
    const [openModalMethod, setOpenModalMethod] = useState(false);

    const colorBlue = '#052BC2';

    const handleAdd = (paymentMethod: PaymentMethod) => {
        setOpenModalMethod(false);
        onMethodSelected(paymentMethod);
    }

    return (
        <View style={styles.container}>
            <View style={styles.contanerTotalValue}>
                <Text style={{ fontSize: 20 }}>Total</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 14 }}>R$</Text>
                    <Text style={{ fontSize: 30, color: colorBlue, textAlign: 'right' }}>{totalAmount}</Text>
                </View>
            </View>
            <ButtonCircle backgroundColor={colorBlue} onPressAdd={() => setOpenModalMethod(true)} />
            <ModalMethod isVisible={openModalMethod} onClose={() => setOpenModalMethod(false)} onSelectMethod={handleAdd} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 8,
        paddingEnd: 8
    },
    contanerTotalValue: {
        flex: 1,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        padding: 4,
        paddingHorizontal: 12
    }
});