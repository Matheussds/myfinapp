import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing } from '../../utils/designSystem';
import Text from './base/Text';

interface LoadingScreenProps {
    message?: string;
    size?: 'small' | 'large';
}

export default function LoadingScreen({ 
    message = 'Carregando...', 
    size = 'large' 
}: LoadingScreenProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <ActivityIndicator 
                    size={size} 
                    color={colors.primary[500]} 
                />
                <Text 
                    variant="body" 
                    color="secondary" 
                    align="center"
                    style={styles.message}
                >
                    {message}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    content: {
        alignItems: 'center',
        padding: spacing.lg,
    },
    
    message: {
        marginTop: spacing.md,
    },
});