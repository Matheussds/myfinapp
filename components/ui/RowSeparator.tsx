import { View } from "react-native";

export default function RowSeparator() {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ height: 6, width: 40, backgroundColor: 'rgba(211, 211, 211, 0.8)', borderRadius: 6 }}></View>
        </View>
    )
}