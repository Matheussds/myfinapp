import { Limit } from '@entity';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import brasilCurrency from '@utils/CurrencyFormatter';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    onOpenMenu: () => void;
    limits: Limit;
    monthTotal: number;
}

export default function HeaderApp(props: Props) {
    return (
        <View style={styles.headerContainer}>
            <View style={{ justifyContent: 'space-between', paddingStart: 40, flexDirection: 'row', alignItems: 'center', height: 50 }}>

                <View style={{ paddingVertical: 4 }}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>Total mensal </Text>
                    <Text style={{ color: '#fff', fontSize: 24 }}>{brasilCurrency(props.monthTotal)}</Text>
                </View>
                <Text style={{ fontSize: 26, color: '#fff', fontWeight: 'bold' }}>MyFin</Text>
                <TouchableOpacity onPress={props.onOpenMenu} style={styles.btnMenu}>
                    <MaterialIcons name="menu-open" size={38} color="#052BC2" />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, padding: 4 }}>
                <View style={{ flexDirection: 'row', paddingStart: 40, gap: 14 }}>
                    <View>
                        <Text style={{ color: '#fff', fontSize: 12 }}>Limite mensal</Text>
                        <Text style={{ color: '#fff' }}>{brasilCurrency(props.limits.monthly_limit)}</Text>
                    </View>
                    <View>
                        <Text style={{ color: '#fff', fontSize: 12 }}>Limite diário</Text>
                        <Text style={{ color: '#fff' }}>{brasilCurrency(props.limits.daily_limit)}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 10,
        height: 100,
        width: '100%',
        backgroundColor: '#052BC2',
        borderBottomStartRadius: 50
    },
    btnMenu: {
        backgroundColor: '#E8E2E2',
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10
    }
})