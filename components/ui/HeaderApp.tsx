import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HeaderApp(props: { onOpenMenu: () => void }) {
    return (
        <View style={styles.headerContainer}>
            <LinearGradient colors={['#02145C', '#052BC2']} style={styles.gradientContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', height: 30 }}>
                    <TouchableOpacity onPress={props.onOpenMenu} style={{ backgroundColor: '#E8E2E2', width:80, height: 40, justifyContent: 'center', alignItems: 'flex-end',  borderBottomLeftRadius: 50 }}>
                        <MaterialIcons name="menu-open" size={38} color="#052BC2" />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, padding: 4 }}>
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
        paddingTop: 10,
        height: 80,
        width: '100%',
        // paddingHorizontal: 8,
        borderBottomLeftRadius: 50
    },
})