import { StyleSheet, View } from "react-native";
import React from "react";

export default function Card({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardContent}>
                <View style={{ backgroundColor: '#000', height: 12, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}></View>
                <View style={styles.mainContent}>
                    {children}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1
    },
    mainContent: {
        flex: 1,
        gap: 2,
        backgroundColor: '#fff',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center'
    },
    valueContainer: {
        flexDirection: 'row',
        minHeight: 50,
        justifyContent: "space-between",
        alignItems: 'center',
        paddingHorizontal: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
})