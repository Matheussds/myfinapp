import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Card, ChooseDisplay, RowValue, RowSeparator, RowDate } from "@ui";
import { HeaderApp, FooterApp } from "@ui/layoutMain";
import { FooterContext, HeaderContext } from "@ui/home";
import { ModalExpense, ModalFull } from "@components/ui/modals";
// import { getExpenses as getMockExpenses } from "@mocks/mockAPI";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getExpenses } from "@api";
import { Expense } from "entity/Expense";
import { DayExpenses, ExpenseDTO, ExpensesMonthYear } from "@api/DTOs/expenseDTO";
import { postExpense } from "@api/expenses";
import { formatDateToMonthYear } from "@utils/DateFormatter";
import { Limit, PaymentMethod } from "entity";
import { getLimits } from "@api/limits";

// Proximas  features:
// Cadastrar o nome dos cartões de crédito
// Ao cadastrar o cartão de crédito, informar a data de fechamento e vencimento e os usuários que podem usar o cartão
// Quando registrar o gasto, informar se é cartão de crédito ou débito ou dinheiro
// Quando for cartão de crédito, informar o número de parcelas ou se é a vista, e escolher o cartão de crédito cadastrado
// Quando for expandir a rowValue mostrar todos os detalhes do gasto

type DayList = {
  totalDay: number;
  date: string;
  expenses: Expense[]
}

// interface Day {
//   date: string;
//   maxValue: number;
//   expenses: Expense[];
// }

type InstallmentsList = {
  guid: string;
  value: number;
  currentInstallment: number;
  totalInstallments: number;
  description: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [openParcelas, setOpenParcelas] = useState(false);
  const [openModalExpense, setOpenModalExpense] = useState(false);
  const [openModalAppSettings, setOpenModalAppSettings] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Credit);
  const [selectedCategoryGUID, setSelectedCategoryGUID] = useState<string | null>(null);
  const [limitsData, setLimitsData] = useState<Limit>({
    daily_limit: 0, monthly_limit: 0
  });
  const [expensesData, setExpensesData] = useState<ExpenseDTO[] | null>(null);
  const [daysList, setDaysList] = useState<DayList[]>([]);
  const [installmentsMonth, setInstallmentsMonth] = useState<InstallmentsList[]>([]);
  const [monthYearOfExpenses, setMonthYearOfExpenses] = useState<string>(formatDateToMonthYear(new Date()));
  const [spentInTheMounth, setSpentInTheMounth] = useState<number>(0);
  const [monthTotal, setMonthTotal] = useState<number>(0);

  const generateKey = () => Math.random().toString(36).slice(2, 11);

  // Função para renderizar cada dia e seus valores
  const renderDay = ({ item }: { item: DayList }) => {
    return (
      <React.Fragment key={generateKey()}>
        <RowDate
          value={item.totalDay}
          month={monthYearOfExpenses}
          date={item.date}
          color={item.totalDay > limitsData.daily_limit ? "red" : "green"}
        />
        {item.expenses.map((value, index) => (
          <React.Fragment key={value.guid}>
            <RowValue
              value={value.value}
              currentInstallment={undefined}
              totalInstallments={undefined}
              description={value.description}
              color={colorBlue}
            />
            {index < item.expenses.length - 1 && <RowSeparator />}
          </React.Fragment>
        ))}
      </React.Fragment>
    );

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

  const colorBlue = '#052BC2';

  const handlePaymentMethod = (paymentMethod: PaymentMethod) => {
    setPaymentMethod(paymentMethod);
    setOpenModalExpense(true);
  }

  const handleAddExpense = async (expense: Expense, day: number) => {
    try {
      expense = await postExpense(expense);
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      return;
    }

    const newExpenseData = expensesData?.map(expData => {
      if (expData.category_guid !== selectedCategoryGUID) {
        return expData;
      }

      const expDate = expData.expenses_month_year.find(exp => exp.month_year === monthYearOfExpenses);
      const dayExpenses = expDate?.day_expenses.find(dayExp => dayExp.day === day.toString().padStart(2, '0'));

      if (dayExpenses) {
        dayExpenses.expenses.push(expense);
        return expData;
      }

      const dayExpense: DayExpenses = {
        day: day.toString().padStart(2, '0'),
        expenses: [expense],
      };

      if (expDate) {
        expDate.day_expenses.push(dayExpense);
        expDate.total_value += expense.value;
        return expData;
      }

      expData.expenses_month_year.push({
        month_year: monthYearOfExpenses,
        total_value: expense.value,
        day_expenses: [dayExpense],
        installments: []
      });

      return expData;
    });

    setExpensesData(newExpenseData ?? []);
  }

  const handleDaysList = (expensesMonthYear: ExpensesMonthYear) => {
    setDaysList([]);

    setDaysList(expensesMonthYear.day_expenses.map(day_expense => ({
      totalDay: day_expense.expenses.reduce((acc, exp) => acc + exp.value, 0),
      date: day_expense.day,
      expenses: day_expense.expenses
    })));
  }

  const handleInstallmentsMonth = (expensesMonthYear: ExpensesMonthYear) => {
    setInstallmentsMonth(expensesMonthYear.installments.map(installment => ({
      guid: installment.guid ?? "",
      value: installment.value,
      currentInstallment: installment.installment_number ?? 0,
      totalInstallments: installment.installments ?? 0,
      description: installment.description,
    })));
  }

  const handleSelectCategory = (guid: string) => {
    setDaysList([]);
    setInstallmentsMonth([]);
    setSpentInTheMounth(0);
    setSelectedCategoryGUID(guid);
    const category = expensesData?.find(exp => exp.category_guid === guid);
    if (!category) return;

    const expensesMonthYear = category.expenses_month_year.find(
      exp => exp.month_year === monthYearOfExpenses);
    if (!expensesMonthYear) return;

    setSpentInTheMounth(expensesMonthYear.total_value);
    handleDaysList(expensesMonthYear);
    handleInstallmentsMonth(expensesMonthYear);
  }

  const loadLimits = async () => {
    try {
      const limitsApi = await getLimits();
      setLimitsData(limitsApi);
    } catch (error) {
      console.log(error);
      console.error("Erro ao buscar os limites");
    }
  }

  const loadExpenses = async () => {
    try {
      const expensesApi = await getExpenses();
      setExpensesData(expensesApi);
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
    }
  };

  const getMonthTotal = () => {
    if (expensesData) {
      const expensesMonthYear: ExpensesMonthYear[] = [];
      expensesData.forEach(expens => {
        const expensesMonth = expens.expenses_month_year.find(emy => emy.month_year === monthYearOfExpenses)
        if (expensesMonth) {
          expensesMonthYear.push(expensesMonth);
        }
      });

      if (expensesMonthYear) {
        const monthTotal = expensesMonthYear.reduce((acc, exp) => acc + exp.total_value, 0);
        return setMonthTotal(monthTotal);
      }
    }

    setMonthTotal(0);
  }

  useEffect(() => {
    handleSelectCategory(selectedCategoryGUID ?? '');
  }, [selectedCategoryGUID, monthYearOfExpenses]); // Adiciona selectedCategoryGUID e dateOfExpenses como dependências


  useEffect(() => {
    console.log("Home renderizada por alteração no mês e ano");
    getMonthTotal();
  }, [monthYearOfExpenses])

  useEffect(() => {
    console.log("Home renderizada");
    setLoading(true); // Inicia o carregamento
    const initialize = async () => {
      await loadLimits();
      await loadExpenses(); // Busca os dados apenas se autenticado
      setLoading(false); // Para o carregamento
    };

    initialize();
  }, []); // Adiciona selectedCategoryGUID e dateOfExpenses como dependências]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} backgroundColor="#052BC2" />
      <HeaderApp limits={limitsData} onOpenMenu={() => setOpenModalAppSettings(true)} monthTotal={monthTotal} />
      <HeaderContext onSelectCategory={setSelectedCategoryGUID} />
      <View style={styles.contentContainer}>
        <Card>
          {openParcelas &&
            <View style={styles.installmentsTitle}>
              <Text style={{ fontSize: 16, color: '#fff' }}>Parcelas</Text>
            </View>
          }
          {(daysList.length == 0 && !openParcelas) || (installmentsMonth.length == 0 && openParcelas) ?
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
            : !openParcelas ?
              <FlatList
                data={daysList}
                renderItem={renderDay}
                keyExtractor={(item) => item.date + item.totalDay.toString() + generateKey()}
              // Ensure each item has a unique 'key' property
              />
              :
              <React.Fragment>
                <FlatList
                  data={installmentsMonth}
                  renderItem={renderInstallments}
                  keyExtractor={(item) => item.guid} />
              </React.Fragment>
          }
        </Card>
        <ChooseDisplay onSetOpenParcelas={setOpenParcelas} isOpenParcelas={openParcelas} />
      </View>
      <FooterContext onMethodSelected={handlePaymentMethod} totalAmount={spentInTheMounth} />
      <FooterApp onDateChange={setMonthYearOfExpenses} />
      {
        selectedCategoryGUID &&
        <ModalExpense
          modalVisible={openModalExpense}
          monthYear={monthYearOfExpenses}
          paymentMethod={paymentMethod}
          categoryGUID={selectedCategoryGUID}
          onClose={() => setOpenModalExpense(false)}
          onAddExpense={handleAddExpense}
        />
      }
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
});