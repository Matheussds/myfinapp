import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ButtonCircle from "@ui/ButtonCircle"; // Adjusted the path to match the correct location
import { Fragment, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { PaymentMethod } from "entity";

interface Props {
    onMethodSelected: (paymentMethod: PaymentMethod) => void;
}

export default function FooterContext({ onMethodSelected }: Props) {
    const [openPaymentMethod, setOpenPaymentMethod] = useState(false);

    const colorBlue = '#052BC2';

    const handleAdd = (paymentMethod: PaymentMethod) => {
        setOpenPaymentMethod(false);
        onMethodSelected(paymentMethod);
    }

    return (
        <View style={styles.container}>
            <View style={{ height: 70, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', flex: 1, borderTopRightRadius: 100, borderBottomRightRadius: 100, padding: 4, paddingHorizontal: 12 }}>
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
                        <TouchableOpacity style={{ height: '100%', justifyContent: "center", width: '50%' }} onPress={() => handleAdd(PaymentMethod.Credit)}>
                            <Text style={{ textAlign: "center" }}>
                                <FontAwesome6 name="credit-card" size={36} color={colorBlue} />
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: '100%', justifyContent: "center", width: '50%' }} onPress={() => handleAdd(PaymentMethod.Money)}>
                            <Text style={{ textAlign: "center" }}>
                                <FontAwesome6 name="money-bill-wave" size={36} color="#0ba313" />
                            </Text>
                        </TouchableOpacity>
                    </Fragment>
                    // <View style={{ flexDirection: 'row', gap: 8, backgroundColor: '#fff', padding: 4, paddingHorizontal: 12, borderRadius: 100 }}>

                    // </View>
                }
            </View>
            <ButtonCircle backgroundColor={!openPaymentMethod ? colorBlue : '#fff'} onPressAdd={() => setOpenPaymentMethod(!openPaymentMethod)}>
                {openPaymentMethod && <Ionicons name="close" size={40} color="#db0c0c" />}
            </ButtonCircle>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        gap: 8,
        paddingEnd: 8
    }
});