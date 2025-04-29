import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    onSetOpenParcelas: (open: boolean) => void;
    isOpenParcelas: boolean;
}

export default function ChooseDisplay({onSetOpenParcelas, isOpenParcelas} : Props) {
    const [openParcelas, setOpenParcelas] = useState(isOpenParcelas);
    const colorBlue = '#052BC2';

    const onSetOpen = (open: boolean) => {
        setOpenParcelas(open);
        onSetOpenParcelas(open);
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <TouchableOpacity onPress={() => onSetOpen(false)}
                style={[styles.btn, styles.btnLeft, { backgroundColor: !openParcelas ? colorBlue : '#fff' }]}>
                <Text style={[styles.title, { color: !openParcelas ? '#fff' : '#000' }]}>Á vista</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSetOpen(true)}
                style={[styles.btn, styles.btnRight, { backgroundColor: openParcelas ? colorBlue : '#fff' }]}>
                <Text style={[styles.title, { color: openParcelas ? '#fff' : '#000' }]}>Parcelas</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        width: '50%',
    },
    btnLeft: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    btnRight: {
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    title: {
        textAlign: "center"
    }
})