import { StyleSheet, Text, View } from "react-native";

export default function RowDate({ value, month, date, color }: { value: number, month: string, date: string, color: string }) {
    return (
        <View style={styles.dateContainer}>
            <Text style={[styles.tagValue, { color }]}>D {value}</Text>
            <Text style={styles.textDate}>{date + "-" + month}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    dateContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 28,
        backgroundColor: '#052BC2',
        paddingHorizontal: 4,
        justifyContent: "space-between",
        alignItems: "center"
    },
    tagValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'green',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        borderRadius: 6
    },
    textDate: {
        fontSize: 16,
        color: '#fff'
    }
});