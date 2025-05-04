import AuthContext from '../../context/AuthContext';
import { User } from '@entity';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { z } from 'zod';
import { fetch } from 'expo/fetch';


const userSchema = z.object({
  username: z.string().min(1, 'Nome de usuário é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[\W_]/, 'A senha deve conter pelo menos um caractere especial'),
});

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  const router = useRouter();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem');
      return;
    }

    setLoading(true);

    try {
      userSchema.parse({ username, email, password });
      // Se a validação passar, você pode prosseguir com o cadastro

      const user: User = {
        name: username,
        email,
        password,
      };

      //TODO usar a instancia do axios
      const response = await fetch('https://rnczk-2804-7f74-bdb-a400-599d-342d-2d9a-e359.a.free.pinggy.link/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const json = await response.json();
      if (!response.ok) {
        console.error('Erro ao validar:', json);
        Alert.alert('Erro', 'Usuário já existe!');
        return
      }
      console.log('Resposta:', json);

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');

     signIn(json.token, json.user.guid, json.user); // Chama a função para marcar como autenticado
      
      router.push('/'); // Redireciona para a tela inicial após o login

    } catch (error) {
      if (error instanceof z.ZodError) {
        Alert.alert('Erro', error.errors.map(err => err.message).join('\n'));
      } else {
        console.error('Erro ao validar:', error);
      }
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text>SignUp Screen</Text>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <TextInput
          style={styles.input}
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={[styles.buttonSignUp, styles.button]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrar</Text>
        {loading && <Text>Carregando...</Text>}
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={[styles.buttonSingIn, styles.button]} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Já tenho conta!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  input: {
    height: 40,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '80%',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    width: '80%',
  },
  buttonSignUp: {
    backgroundColor: '#000',
  },
  buttonSingIn: {
    backgroundColor: '#4285F4',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
    width: '80%',
  }
});

export default SignUp;