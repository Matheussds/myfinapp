import { Ionicons } from "@expo/vector-icons";
import { formatDateToMonthYear } from "@utils/DateFormatter";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
    onDateChange: (monthYear: string) => void;
}
const formatDate = (month: number, year: number) => {
    const date = new Date(year, month);
    const monthName = date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
    return `${monthName}/${year}`;
};

export default function FooterApp({ onDateChange }: Props) {
    const [date, setDate] = useState(new Date());
    const colorBlue = '#052BC2';

    const handleIncrease = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() + 1);
        setDate(newDate);
        onDateChange(formatDateToMonthYear(newDate));
    };

    const handleDecrease = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() - 1);
        setDate(newDate);
        onDateChange(formatDateToMonthYear(newDate));
    };

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity style={{ flex: 1, alignItems: 'flex-start', paddingStart: 20 }} onPress={() => handleDecrease()}>
                <Ionicons name="chevron-back" size={40} color={colorBlue} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, color: '#000', flex: 1, textAlign: 'center' }}>
                {formatDate(date.getMonth(), date.getFullYear())}
            </Text>
            <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 20 }} onPress={() => handleIncrease()}>
                <Ionicons name="chevron-forward" size={40} color={colorBlue} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 80,
        width: '100%',
        backgroundColor: '#fff',
        borderTopRightRadius: 50
    },
})