import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/ui/Card";
import React, { useEffect, useState } from "react";
import { RowDate } from "@/components/ui/RowDate";
import RowValue from "@/components/ui/RowValue";
import RowSeparator from "@/components/ui/RowSeparator";
import HeaderApp from "@/components/ui/HeaderApp";
import FooterApp from "@/components/ui/FooterApp";
import FooterContext from "@/components/ui/FooterContext";
import HeaderContext from "@/components/ui/HeaderContext";
import ChooseDisplay from "@/components/ui/ChooseDisplay";
import ModalExpense, { Expense } from "@/components/ui/ModalExpense";
import ModalFull from "@/components/ui/ModalFull";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { getExpenses } from "@/mocks/mockAPI";
import ButtonCircle from "@/components/ui/ButtonCircle";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

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

type ExpenseData = {
  categoryId: string;
  category: string;
  dates: {
    year: number;
    month: number;
    expenseList: DayList[];
    installments: InstallmentsList[];
  }[];
};


// Removed duplicate ExpenseData type definition

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, signOut } = useAuth();
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [openParcelas, setOpenParcelas] = useState(false);
  const [openModalExpense, setOpenModalExpense] = useState(false);
  const [openModalAppSettings, setOpenModalAppSettings] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'MONEY'>('CARD');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [expenseData, setExpenseData] = useState<ExpenseData[] | null>(null);
  const [dayList, setDayList] = useState<DayList[]>([]);
  const [installments, setInstallments] = useState<InstallmentsList[]>([]);

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
  })),
  ]);

  const flattenedDataInstallments = installments.map(installment => ({
    ...installment,
    key: generateKey(), // Pode ajustar para garantir que seja único
  }));

  const colorBlue = '#052BC2';

  const handlePaymentMethod = (paymentMethod: 'CARD' | 'MONEY') => {
    setPaymentMethod(paymentMethod);
    setOpenModalExpense(true);
  }

  const handleAddExpense = (expense: Expense) => {
    console.log('Adicionando gasto', expense);

    const newExpenseData = expenseData?.map(expData => {
      if (expData.categoryId === selectedCategoryId) {
        const expDate = expData.dates[0].expenseList.find(exp => exp.date === expense.date);
        if (expDate) {
          expDate.values.push({
            value: expense.value,
            description: expense.description
          });
        } else {
          expData.dates[0].expenseList.push({
            date: expense.date,
            maxValue: 1000,
            values: [{
              value: expense.value,
              description: expense.description
            }]
          });
        }
      }
      return expData;
    });

    setExpenseData(newExpenseData ?? []);
  }

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedCategoryId(expenseData?.find(expense => expense.category === category)?.categoryId ?? '');
    setDayList(expenseData?.find(expense => expense.category === category)?.dates[0].expenseList ?? []);
    setInstallments(expenseData?.find(expense => expense.category === category)?.dates[0].installments ?? []);
    console.log('Categoria selecionada', category);
  }


  useEffect(() => {
    const fetchData = async () => {
      // Simular uma verificação inicial, pode ser um fetch de autenticação
      const checkAuth = async () => {
        setLoading(false); // Após a verificação, pare o carregamento
        console.log('isAuthenticated', isAuthenticated);
        // if (!isAuthenticated) {
        //   console.log('Chamou login: ');
        //   router.push('/login'); // Redireciona para a tela de login
        // }
      };

      await checkAuth();

      const expensesAsync = await getExpenses();

      setExpenseData(expensesAsync);
    };

    fetchData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} backgroundColor="#02145C" />
      <HeaderApp onOpenMenu={() => setOpenModalAppSettings(true)} />
      <HeaderContext onSelectCategory={handleSelectCategory} />
      <View style={styles.contentContainer}>
        <Card>
          {!openParcelas ? flattenedData.length ?
            <FlatList
              data={flattenedData}
              renderItem={renderDay}
              keyExtractor={(item) => item.key} // Chave única para cada item
            />
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 6 }}>
              <Text>Adicione um novo gasto</Text>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <MaterialIcons name="touch-app" size={34} color={colorBlue} />
                <Ionicons name="arrow-redo" size={24} color={colorBlue} />
                <View style={styles.buttonCircle}>
                  <Ionicons name="add" size={20} color='#fff' />
                </View>
              </View>
            </View>
            :
            <React.Fragment>

              <View style={styles.installmentsTitle}>
                <Text style={{ fontSize: 16, color: '#fff' }}>Parcelas</Text>
              </View>
              {flattenedDataInstallments.length ?
                <FlatList
                  data={flattenedDataInstallments}
                  renderItem={renderInstallments}
                  keyExtractor={(item) => item.key}
                />
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>Adicione um novo gasto</Text>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                    <MaterialIcons name="touch-app" size={34} color={colorBlue} />
                    <Ionicons name="arrow-redo" size={24} color={colorBlue} />
                    <View style={styles.buttonCircle}>
                      <Ionicons name="add" size={20} color='#fff' />
                    </View>
                  </View>
                </View>}
            </React.Fragment>

          }
        </Card>
        <ChooseDisplay onSetOpenParcelas={setOpenParcelas} />
      </View>
      <FooterContext onMethodSelected={handlePaymentMethod} />
      <FooterApp />

      <ModalExpense modalVisible={openModalExpense} paymentMethod={paymentMethod} onSetVisible={setOpenModalExpense} categoryID={selectedCategoryId} onAddExpense={handleAddExpense} />
      <ModalFull isVisible={openModalAppSettings} onClose={() => setOpenModalAppSettings(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    paddingHorizontal: 8,
    gap: 8
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
  buttonCircle: {
    borderRadius: '100%',
    padding: 7,
    backgroundColor: '#052BC2',
  }
})