import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SignUp: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>SignUp Screen</Text>
      {/* Adicione campos e lógica de cadastro aqui */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignUp;