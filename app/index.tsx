import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/ui/Card";
import React from "react";
import { RowDate } from "@/components/ui/RowDate";
import RowValue from "@/components/ui/RowValue";
import RowSeparator from "@/components/ui/RowSeparator";
import HeaderApp from "@/components/ui/HeaderApp";
import FooterApp from "@/components/ui/FooterApp";
import FooterContext from "@/components/ui/FooterContext";
import HeaderContext from "@/components/ui/HeaderContext";

// Proximas  features:
// Cadastrar o nome dos cartões de crédito
// Ao cadastrar o cartão de crédito, informar a data de fechamento e vencimento e os usuários que podem usar o cartão
// Quando registrar o gasto, informar se é cartão de crédito ou débito ou dinheiro
// Quando for cartão de crédito, informar o número de parcelas ou se é a vista, e escolher o cartão de crédito cadastrado
// Quando for expandir a rowValue mostrar todos os detalhes do gasto

type DayList = {
  maxValue: number;
  date: string;
  values: {
    value: number;
    description: string;
  }[]
}

interface Value {
  value: number;
  description: string;
}
interface Day {
  date: string;
  maxValue: number;
  values: Value[];
}

type InstallmentsList = {
  value: number;
  currentInstallment: number;
  totalInstallments: number;
  description: string;
}


export default function Index() {
  // crie um array de objetos com os valores que podem ter dentreo do valueContainer component
  // acrsescente também os objetos que não tem todos os valores preenchidos
  const dayList: DayList[] = [
    {
      maxValue: 100.00, date: '14/01', values: [
        { value: 50.00, description: 'Carregador' },
        { value: 50.00, description: '' },
      ]
    },
    {
      maxValue: 100.00, date: '12/01', values: [
        { value: 100.00, description: 'Fruteira' },
        { value: 20.50, description: '' },
        { value: 16.80, description: '' },
      ]
    }
  ]

  const installments: InstallmentsList[] = [
    { value: 50.00, currentInstallment: 1, totalInstallments: 10, description: 'Carregador' },
    { value: 50.00, currentInstallment: 1, totalInstallments: 10, description: 'Carregador' },
    { value: 100.00, currentInstallment: 1, totalInstallments: 10, description: 'Carregador' }
  ]

  const exceededLimit = (dayValues: number[], limitValue: number) => {
    const total = dayValues.reduce((acc, value) => acc + value, 0);
    return total > limitValue;
  }

  const generateKey = () => Math.random().toString(36).slice(2, 11);

  // Função para renderizar cada dia e seus valores
  const renderDay = ({ item }: { item: Day | InstallmentsList | Value }) => {
    if ("maxValue" in item) { // Verifica se o item é um Day
      return (
        <React.Fragment key={generateKey()}>
          <RowDate
            value={item.maxValue}
            date={item.date}
            color={exceededLimit(item.values.map(value => value.value), item.maxValue) ? "red" : "green"}
          />
          {item.values.map((value, index) => (
            <React.Fragment key={generateKey()}>
              <RowValue
                value={value.value}
                currentInstallment={undefined}
                totalInstallments={undefined}
                description={value.description}
                color={colorBlue}
              />
              {index < item.values.length - 1 && <RowSeparator />}
            </React.Fragment>
          ))}
        </React.Fragment>
      );
    } else {
      return null; // Caso não seja um item válido
    }
  };

  const renderInstallments = ({ item }: { item: InstallmentsList }) => {
    return (
      <React.Fragment key={generateKey()}>
        <RowValue
          value={item.value}
          currentInstallment={item.currentInstallment}
          totalInstallments={item.totalInstallments}
          description={item.description}
          color={colorBlue}
        />
        <RowSeparator />
      </React.Fragment>
    );
  }

  // Função para achatar a lista (flatten) para o FlatList
  const flattenedData = dayList.flatMap(day => [{
    ...day,
    key: generateKey(), // Usando a data como chave
  }, ...day.values.map((value) => ({
    ...value,
    key: generateKey(), // Pode ajustar para garantir que seja único
  }))]);

  const colorBlue = '#052BC2';
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} backgroundColor="#02145C" />
      <HeaderApp />
      <HeaderContext />
      <View style={styles.contentContainer}>
        <Card>
          <FlatList
            data={flattenedData}
            renderItem={renderDay}
            keyExtractor={(item) => item.key} // Chave única para cada item
          />
          {installments.length > 0 && (
            <View style={styles.installmentsTitle}>
              <Text style={{ fontSize: 16, color: '#fff' }}>Parcelas</Text>
            </View>
          )}
          <FlatList
            data={installments}
            renderItem={renderInstallments}
            keyExtractor={(item) => item.value.toString()} // Chave única para cada item
          />
        </Card>
      </View>
      <FooterContext />
      <FooterApp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    backgroundColor: "#E8E2E2",
    alignItems: "center",
    justifyContent: "space-between"
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  installmentsTitle: {
    flexDirection: 'row',
    width: '100%',
    height: 28,
    backgroundColor: '#052BC2',
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center"
  },
})