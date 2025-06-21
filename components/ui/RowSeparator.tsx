import { View, StyleSheet } from "react-native";
import { colors, spacing, borderRadius } from "../../utils/designSystem";

export default function RowSeparator() {
    return (
        <View style={styles.container}>
            <View style={styles.separator}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xs,
    },
    separator: {
        height: 6,
        width: 40,
        backgroundColor: colors.neutral[200],
        borderRadius: borderRadius.sm,
    }
});