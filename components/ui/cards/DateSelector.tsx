import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    daySelected?: number;
    onSelectDay: (day: number) => void;
}

export default function DateSelector(props: Props) {
    const [daySelected, setDaySelected] = useState<number>(props.daySelected ?? 1);
    const monthDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

    const handlerDaySelect = (day: number) => {
        setDaySelected(day);
        props.onSelectDay(day);
    }

    return (
        <View style={styles.btnContainer}>
            <FlatList horizontal data={monthDays} renderItem={(day) =>
                <TouchableOpacity style={[styles.btnNumber, day.item == daySelected && styles.btnSelected]} onPress={() => handlerDaySelect(day.item)}>
                    <Text style={[styles.btnText, day.item == daySelected && styles.btnTextSelected]}>{day.item}</Text>
                </TouchableOpacity>
            } />
        </View>
    )
}

const styles = StyleSheet.create({
    btnContainer: {
        width: '100%'
    },
    btnNumber: {
        height: 40,
        width: 40,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: 'blue',
        fontSize: 20
    },
    btnTextSelected: {
        color: '#fff'
    },
    btnSelected: {
        backgroundColor: 'blue'
    }
})