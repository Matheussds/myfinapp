import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StatusBar, StyleSheet, View, SafeAreaView, TouchableOpacity } from "react-native";
import { Card, ChooseDisplay, RowValue, RowSeparator, RowDate, LoadingScreen } from "@ui";
import { HeaderApp, FooterApp } from "@ui/layoutMain";
import { FooterContext, HeaderContext } from "@ui/home";
import { ModalExpense, ModalFull, ModalPaymentMethod } from "@components/ui/modals";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getExpenses } from "@api";
import { Expense } from "entity/Expense";
import { DayExpenses, ExpenseDTO, ExpensesMonthYear } from "@api/DTOs/expenseDTO";
import { formatDateToMonthYear } from "@utils/DateFormatter";
import { Limit, PaymentMethod, Category } from "entity";
import { getLimits } from "@api/limits";
import { GENERAL_CATEGORY_GUID } from "@utils/constants";
import { colors, spacing, borderRadius, shadows } from "../../utils/designSystem";
import Text from "../../components/ui/base/Text";
import { getCategories } from "@api/categories";
import * as SecureStore from 'expo-secure-store';

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

type InstallmentsList = {
  guid: string;
  value: number;
  currentInstallment: number;
  totalInstallments: number;
  description: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [openParcelas, setOpenParcelas] = useState(false);
  const [openModalExpense, setOpenModalExpense] = useState(false);
  const [openModalPaymentMethod, setOpenModalPaymentMethod] = useState(false);
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
  const [categories, setCategories] = useState<Category[]>([]);

  console.log('Estado dos modais:', { openModalExpense, openModalPaymentMethod, openModalAppSettings });
  console.log('Estado da categoria:', { selectedCategoryGUID });
  console.log('Estado do payment method:', { paymentMethod });

  // Função para renderizar cada dia e seus valores
  const renderDay = ({ item }: { item: DayList }) => {
    const isOverLimit = item.totalDay > limitsData.daily_limit;
    
    return (
      <React.Fragment key={`day-${item.date}`}>
        <RowDate
          value={item.totalDay}
          month={monthYearOfExpenses}
          date={item.date}
          color={isOverLimit ? "error" : "success"}
        />
        {item.expenses.map((value, index) => (
          <React.Fragment key={value.guid || `expense-${item.date}-${index}`}>
            <RowValue
              value={value.value}
              currentInstallment={undefined}
              totalInstallments={undefined}
              description={value.description}
              color={colors.primary[500]}
            />
            {index < item.expenses.length - 1 && <RowSeparator />}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  const renderInstallments = ({ item }: { item: InstallmentsList }) => {
    return (
      <React.Fragment key={`installment-${item.guid}`}>
        <RowValue
          value={item.value}
          currentInstallment={item.currentInstallment}
          totalInstallments={item.totalInstallments}
          description={item.description}
          color={colors.primary[500]}
        />
        <RowSeparator />
      </React.Fragment>
    );
  };

  const handlePaymentMethod = (paymentMethod: PaymentMethod, shouldOpenModal: boolean = true) => {
    console.log('handlePaymentMethod chamado com:', paymentMethod, 'shouldOpenModal:', shouldOpenModal);
    setPaymentMethod(paymentMethod);
    
    // Só abre o modal se for uma ação explícita do usuário
    if (!shouldOpenModal) {
      console.log('Não abrindo modal - inicialização');
      return;
    }
    
    // Não permite adicionar despesas quando a categoria "Todos os gastos" está selecionada
    if (selectedCategoryGUID === GENERAL_CATEGORY_GUID) {
      console.log('Categoria "Todos os gastos" selecionada, não abrindo modal');
      return;
    }
    console.log('Abrindo modal de forma de pagamento');
    setOpenModalPaymentMethod(true);
  };

  const handleSelectPaymentMethod = (selectedPaymentMethod: PaymentMethod) => {
    console.log('Forma de pagamento selecionada:', selectedPaymentMethod);
    setPaymentMethod(selectedPaymentMethod);
    setOpenModalPaymentMethod(false);
    setOpenModalExpense(true);
  };

  const handleAddExpense = (expenses: Expense[]) => {
    if (!expensesData) return;

    const newExpensesData = expensesData.map(expData => {
      if (expData.category_guid !== selectedCategoryGUID) {
        return expData;
      }

      // Cria uma cópia profunda do objeto para evitar mutação
      const updatedExpData = JSON.parse(JSON.stringify(expData));
      
      expenses.forEach((expense) => {
        console.log("Expense adicionada: ", expense);

        const expDate = updatedExpData.expenses_month_year.find(
          (exp: any) => exp.month_year === monthYearOfExpenses
        );
        
        const dayOfExpense = new Date(expense.spent_at).getDate();
        const dayExpenses = expDate?.day_expenses.find(
          (dayExp: any) => dayExp.day === dayOfExpense.toString().padStart(2, '0')
        );

        if (dayExpenses) {
          // Adiciona a nova despesa ao array existente
          dayExpenses.expenses = [...dayExpenses.expenses, expense];
          if (expDate) {
            expDate.total_value += expense.value;
          }
        } else {
          const dayExpense: DayExpenses = {
            day: dayOfExpense.toString().padStart(2, '0'),
            expenses: [expense],
          };

          if (expDate) {
            expDate.day_expenses = [...expDate.day_expenses, dayExpense];
            expDate.total_value += expense.value;
          } else {
            // Cria novo mês/ano se não existir
            updatedExpData.expenses_month_year.push({
              month_year: monthYearOfExpenses,
              total_value: expense.value,
              day_expenses: [dayExpense],
              installments: []
            });
          }
        }

        // Se for uma despesa parcelada, adiciona às parcelas
        if (expense.installments && expense.installments > 1) {
          if (expDate) {
            expDate.installments = [...expDate.installments, expense];
          }
        }
      });

      return updatedExpData;
    });

    console.log("Novos dados de despesas:", JSON.stringify(newExpensesData));
    
    // Atualiza o estado
    setExpensesData(newExpensesData);
  };

  // Função para debug das parcelas
  const debugInstallments = (installments: any[], source: string) => {
    console.log(`\n=== DEBUG PARCELAS - ${source} ===`);
    console.log(`Total de parcelas: ${installments.length}`);
    installments.forEach((installment, index) => {
      console.log(`${index + 1}. ${installment.description} - GUID: ${installment.guid} - Valor: ${installment.value}`);
    });
    console.log('=== FIM DEBUG ===\n');
  };

  const handleDaysList = (expensesMonthYear: ExpensesMonthYear) => {
    console.log('handleDaysList: limpando e recarregando dados para:', monthYearOfExpenses);
    setDaysList([]);

    const newDaysList = expensesMonthYear.day_expenses.map(day_expense => {
      // Para categorias específicas, filtra apenas gastos à vista (não parcelados)
      const expensesToShow = selectedCategoryGUID === GENERAL_CATEGORY_GUID 
        ? day_expense.expenses 
        : day_expense.expenses.filter(expense => !expense.installments || expense.installments <= 1);
      
      return {
        totalDay: expensesToShow.reduce((acc, exp) => acc + exp.value, 0),
        date: day_expense.day,
        expenses: expensesToShow
      };
    });

    setDaysList(newDaysList);
    console.log('handleDaysList: dados carregados:', newDaysList.length, 'dias');
  };

  const handleInstallmentsMonth = (expensesMonthYear: ExpensesMonthYear) => {
    console.log('=== handleInstallmentsMonth INICIADO ===');
    console.log('Total de parcelas recebidas:', expensesMonthYear.installments.length);
    
    // Debug das parcelas recebidas
    debugInstallments(expensesMonthYear.installments, 'ANTES DA DEDUPLICAÇÃO');
    
    // Cria um Map para remover duplicatas baseado em uma chave mais robusta
    const uniqueInstallments = new Map<string, InstallmentsList>();
    
    expensesMonthYear.installments.forEach(installment => {
      // Cria uma chave única mais robusta que considera múltiplas propriedades
      const key = `${installment.guid || 'no-guid'}-${installment.description}-${installment.value}-${installment.installment_number || 1}`;
      console.log(`Parcela: ${installment.description}, GUID: ${installment.guid}, Chave: ${key}`);
      
      if (!uniqueInstallments.has(key)) {
        uniqueInstallments.set(key, {
          guid: key,
          value: installment.value,
          currentInstallment: installment.installment_number || 1,
          totalInstallments: installment.installments || 1,
          description: installment.description
        });
        console.log(`✅ Parcela adicionada: ${installment.description}`);
      } else {
        console.log(`❌ Parcela duplicada ignorada: ${installment.description}`);
      }
    });

    const newInstallments = Array.from(uniqueInstallments.values());
    console.log('=== RESUMO handleInstallmentsMonth ===');
    console.log('Total de parcelas únicas:', newInstallments.length);
    console.log('Parcelas:', newInstallments.map(p => p.description));
    console.log('=== FIM handleInstallmentsMonth ===');
    
    setInstallmentsMonth(newInstallments);
  };

  const handleSelectCategory = (guid: string) => {
    console.log('=== handleSelectCategory INICIADO ===');
    console.log('GUID recebido:', guid);
    console.log('Data atual:', monthYearOfExpenses);
    console.log('Categorias disponíveis:', categories.map(c => ({ guid: c.guid, name: c.name })));
    
    // Atualiza a categoria selecionada
    setSelectedCategoryGUID(guid);
    
    // Salva a categoria selecionada
    const selectedCategory = categories.find(cat => cat.guid === guid);
    if (selectedCategory) {
      SecureStore.setItemAsync('selectedCategory', JSON.stringify(selectedCategory));
      console.log('Categoria salva no storage:', selectedCategory.name);
    }
    
    if (!expensesData) {
      console.log('expensesData não disponível');
      console.log('=== handleSelectCategory FINALIZADO ===');
      return;
    }

    console.log('Dados de despesas disponíveis:', expensesData.map(exp => ({ 
      category_guid: exp.category_guid, 
      month_years: exp.expenses_month_year.map(my => my.month_year) 
    })));

    // Verifica se é a categoria "Todos os gastos"
    if (guid === GENERAL_CATEGORY_GUID) {
      console.log('Categoria "Todos os gastos" selecionada - unificando dados');
      console.log('GENERAL_CATEGORY_GUID:', GENERAL_CATEGORY_GUID);
      console.log('GUID recebido:', guid);
      console.log('São iguais?', guid === GENERAL_CATEGORY_GUID);
      
      // Unifica todos os gastos de todas as categorias para o mês/ano selecionado
      const unifiedExpenses: Expense[] = [];
      let totalValue = 0;
      
      expensesData.forEach(expData => {
        const monthYearData = expData.expenses_month_year.find(
          exp => exp.month_year === monthYearOfExpenses
        );
        
        if (monthYearData) {
          // Adiciona todos os gastos do dia ao array unificado
          monthYearData.day_expenses.forEach(dayExp => {
            dayExp.expenses.forEach(expense => {
              unifiedExpenses.push(expense);
            });
          });
          
          totalValue += monthYearData.total_value;
        }
      });
      
      console.log('Gastos unificados:', unifiedExpenses.length, 'total:', totalValue);
      
      // Agrupa os gastos por dia
      const groupedByDay = unifiedExpenses.reduce((acc, expense) => {
        const day = new Date(expense.spent_at).getDate().toString().padStart(2, '0');
        
        if (!acc[day]) {
          acc[day] = {
            totalDay: 0,
            date: day,
            expenses: []
          };
        }
        
        acc[day].expenses.push(expense);
        acc[day].totalDay += expense.value;
        
        return acc;
      }, {} as Record<string, DayList>);
      
      // Converte para array e ordena por data
      const unifiedDaysList = Object.values(groupedByDay).sort((a, b) => 
        parseInt(a.date) - parseInt(b.date)
      );
      
      console.log('Dias unificados:', unifiedDaysList.length);
      
      setDaysList(unifiedDaysList);
      
      // Unifica todas as parcelas usando a nova função
      unifyAllInstallments();
      
      console.log('Dados unificados carregados com sucesso');
    } else {
      // Lógica original para categorias específicas
      const selectedExpenseData = expensesData.find(expData => expData.category_guid === guid);
      
      if (selectedExpenseData) {
        console.log('Dados da categoria encontrados:', selectedExpenseData.category_guid);
        const expensesMonthYear = selectedExpenseData.expenses_month_year.find(
          exp => exp.month_year === monthYearOfExpenses
        );

        if (expensesMonthYear) {
          console.log('Dados do mês/ano encontrados:', expensesMonthYear.month_year);
          console.log('Total de dias:', expensesMonthYear.day_expenses.length);
          console.log('Total de parcelas:', expensesMonthYear.installments.length);
          console.log('Valor total:', expensesMonthYear.total_value);
          
          handleDaysList(expensesMonthYear);
          
          // Para categorias específicas, não carrega parcelas
          if (guid === GENERAL_CATEGORY_GUID) {
            handleInstallmentsMonth(expensesMonthYear);
          } else {
            setInstallmentsMonth([]); // Limpa parcelas para categorias específicas
          }
          
          console.log('Dados da categoria carregados com sucesso');
        } else {
          console.log('Nenhum dado encontrado para o mês/ano:', monthYearOfExpenses);
          setDaysList([]);
          setInstallmentsMonth([]);
        }
      } else {
        console.log('Categoria não encontrada nos dados de despesas');
        setDaysList([]);
        setInstallmentsMonth([]);
      }
    }
    
    console.log('=== handleSelectCategory FINALIZADO ===');
  };

  const loadLimits = async () => {
    try {
      const limits = await getLimits();
      setLimitsData(limits);
    } catch (error) {
      console.error('Erro ao carregar limites:', error);
    }
  };

  const loadExpenses = async () => {
    try {
      const expenses = await getExpenses();
      setExpensesData(expenses);
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      
      // Adiciona a categoria "Todos os gastos" se existirem categorias
      let allCategories = [...categoriesData];
      if (categoriesData.length > 0) {
        const generalCategory: Category = {
          guid: GENERAL_CATEGORY_GUID,
          name: "Todos os gastos"
        };
        allCategories.unshift(generalCategory); // Adiciona no início
      }
      
      setCategories(allCategories);
      
      // Carrega categoria salva ou seleciona a primeira
      const storedCategory = await SecureStore.getItemAsync('selectedCategory');
      const storedCategoryParse: Category | null = JSON.parse(storedCategory || 'null');
      
      if (storedCategoryParse && allCategories.find(cat => cat.guid === storedCategoryParse.guid)) {
        setSelectedCategoryGUID(storedCategoryParse.guid || null);
      } else if (allCategories.length > 0) {
        setSelectedCategoryGUID(allCategories[0].guid || null);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const getMonthTotal = () => {
    if (!expensesData) return 0;

    // Total mensal sempre inclui parcelas (para qualquer categoria)
    const total = expensesData.reduce((total, expData) => {
      const monthExpenses = expData.expenses_month_year.find(
        exp => exp.month_year === monthYearOfExpenses
      );
      return total + (monthExpenses?.total_value || 0);
    }, 0);

    console.log('getMonthTotal (total mensal com parcelas):', total, 'para data:', monthYearOfExpenses);
    return total;
  };

  const getCategoryTotal = () => {
    if (!expensesData || !selectedCategoryGUID) return 0;

    // Se "Todos os gastos" estiver selecionado, calcula o total de todas as categorias
    if (selectedCategoryGUID === GENERAL_CATEGORY_GUID) {
      const total = expensesData.reduce((total, expData) => {
        const monthExpenses = expData.expenses_month_year.find(
          exp => exp.month_year === monthYearOfExpenses
        );
        return total + (monthExpenses?.total_value || 0);
      }, 0);

      console.log('getCategoryTotal (Todos os gastos):', total, 'para data:', monthYearOfExpenses);
      return total;
    }

    // Para categorias específicas, calcula apenas o total da categoria selecionada (sem parcelas)
    const selectedExpenseData = expensesData.find(expData => expData.category_guid === selectedCategoryGUID);
    if (selectedExpenseData) {
      const monthExpenses = selectedExpenseData.expenses_month_year.find(
        exp => exp.month_year === monthYearOfExpenses
      );
      
      if (monthExpenses) {
        // Calcula apenas gastos à vista (não parcelados)
        const totalValue = monthExpenses.day_expenses.reduce((total, dayExp) => {
          const dayTotal = dayExp.expenses.reduce((daySum, expense) => {
            // Só inclui se não for parcelado ou se for parcela única
            if (!expense.installments || expense.installments <= 1) {
              return daySum + expense.value;
            }
            return daySum;
          }, 0);
          return total + dayTotal;
        }, 0);
        
        console.log('getCategoryTotal (categoria específica - apenas à vista):', totalValue, 'para data:', monthYearOfExpenses);
        return totalValue;
      }
    }

    console.log('getCategoryTotal: categoria não encontrada');
    return 0;
  };

  const getCategoryName = () => {
    if (!selectedCategoryGUID) return "categoria";
    
    if (selectedCategoryGUID === GENERAL_CATEGORY_GUID) {
      return "todas as categorias";
    }
    
    const category = categories.find(cat => cat.guid === selectedCategoryGUID);
    return category?.name || "categoria";
  };

  useEffect(() => {
    const initialize = async () => {
      console.log('Inicialização iniciada');
      setLoading(true);
      try {
        await Promise.all([loadLimits(), loadExpenses(), loadCategories()]);
      } catch (error) {
        console.error('Erro na inicialização:', error);
      } finally {
        setLoading(false);
        console.log('Inicialização concluída');
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    setMonthTotal(getMonthTotal());
  }, [expensesData, monthYearOfExpenses]);

  // useEffect para calcular o total da categoria selecionada
  useEffect(() => {
    setSpentInTheMounth(getCategoryTotal());
  }, [expensesData, monthYearOfExpenses, selectedCategoryGUID]);

  // Novo useEffect para recarregar dados quando a data muda
  useEffect(() => {
    console.log('Data alterada para:', monthYearOfExpenses);
    // Se há uma categoria selecionada, recarrega os dados para a nova data
    if (selectedCategoryGUID && expensesData) {
      console.log('Recarregando dados para nova data');
      handleSelectCategory(selectedCategoryGUID);
    }
  }, [monthYearOfExpenses]);

  // Carrega dados da categoria quando ela é selecionada pela primeira vez
  useEffect(() => {
    if (selectedCategoryGUID && expensesData && !loading) {
      console.log('Carregando dados da categoria selecionada:', selectedCategoryGUID);
      
      // Se a categoria for específica (não "Todos os gastos"), força para visualização à vista
      if (selectedCategoryGUID !== GENERAL_CATEGORY_GUID) {
        setOpenParcelas(false);
      }
      
      handleSelectCategory(selectedCategoryGUID);
    }
  }, [selectedCategoryGUID, expensesData, loading]);

  // Função para unificar parcelas de todas as categorias
  const unifyAllInstallments = () => {
    if (!expensesData) return;
    
    const allInstallments: InstallmentsList[] = [];
    const seenKeys = new Set<string>();
    
    console.log('=== UNIFICANDO PARCELAS DE TODAS AS CATEGORIAS ===');
    console.log('Total de categorias:', expensesData.length);
    
    expensesData.forEach((expData, categoryIndex) => {
      const monthYearData = expData.expenses_month_year.find(
        exp => exp.month_year === monthYearOfExpenses
      );
      
      if (monthYearData && monthYearData.installments.length > 0) {
        console.log(`\n--- Categoria ${categoryIndex + 1}: ${expData.category_guid} ---`);
        console.log(`Parcelas encontradas: ${monthYearData.installments.length}`);
        
        monthYearData.installments.forEach((installment, index) => {
          // Cria uma chave única baseada em propriedades essenciais
          const uniqueKey = `${installment.guid || 'no-guid'}-${installment.description}-${installment.value}`;
          
          console.log(`Parcela ${index + 1}: ${installment.description} - Chave: ${uniqueKey}`);
          
          if (!seenKeys.has(uniqueKey)) {
            seenKeys.add(uniqueKey);
            
            const newInstallment: InstallmentsList = {
              guid: uniqueKey,
              value: installment.value,
              currentInstallment: installment.installment_number || 1,
              totalInstallments: installment.installments || 1,
              description: `${installment.description} (${expData.category_guid})`
            };
            
            allInstallments.push(newInstallment);
            console.log(`✅ Adicionada: ${installment.description}`);
          } else {
            console.log(`❌ Duplicada (ignorada): ${installment.description}`);
          }
        });
      }
    });
    
    console.log('\n=== RESUMO UNIFICAÇÃO ===');
    console.log('Total de parcelas únicas:', allInstallments.length);
    console.log('Chaves únicas no Set:', seenKeys.size);
    console.log('Parcelas finais:', allInstallments.map(p => p.description));
    console.log('=== FIM UNIFICAÇÃO ===\n');
    
    setInstallmentsMonth(allInstallments);
  };

  // Componente para estado vazio
  const EmptyState = () => {
    const isGeneralCategory = selectedCategoryGUID === GENERAL_CATEGORY_GUID;
    const isInstallmentsView = openParcelas;
    
    let title = "Nenhum gasto encontrado";
    let description = "Adicione seu primeiro gasto para começar a controlar suas finanças";
    let iconName = "wallet-outline";
    let showAddButton = true;
    
    if (isGeneralCategory && isInstallmentsView) {
      title = "Nenhuma parcela encontrada";
      description = "Não há parcelas registradas para este mês.";
      iconName = "card-outline";
      showAddButton = false;
    } else if (isGeneralCategory && !isInstallmentsView) {
      title = "Nenhum gasto encontrado";
      description = "Não há gastos registrados para este mês.";
      iconName = "wallet-outline";
      showAddButton = false;
    } else if (!isGeneralCategory && isInstallmentsView) {
      title = "Nenhuma parcela nesta categoria";
      description = "Esta categoria não possui gastos parcelados. Adicione um gasto parcelado para começar.";
      iconName = "card-outline";
      showAddButton = true;
    } else {
      title = "Nenhum gasto nesta categoria";
      description = "Adicione um gasto nesta categoria para começar";
      iconName = "wallet-outline";
      showAddButton = true;
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons name={iconName as any} size={64} color={colors.neutral[400]} />
        </View>
        <Text variant="h4" color="secondary" weight="medium" align="center" style={styles.emptyTitle}>
          {title}
        </Text>
        <Text variant="body" color="tertiary" align="center" style={styles.emptyDescription}>
          {description}
        </Text>
        {showAddButton && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handlePaymentMethod(paymentMethod, true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color={colors.text.inverse} />
            <Text variant="body" color="inverse" weight="medium" style={styles.addButtonText}>
              Adicionar Gasto
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return <LoadingScreen message="Carregando suas finanças..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary[500]} />
      
      {/* Header */}
      <HeaderApp
        onOpenMenu={() => setOpenModalAppSettings(true)}
        limits={limitsData}
        monthTotal={monthTotal}
      />

      {/* Conteúdo principal */}
      <View style={styles.content}>
        {/* Seletor de categoria */}
        <HeaderContext
          onSelectCategory={handleSelectCategory}
          categories={categories}
          selectedCategoryGUID={selectedCategoryGUID}
          isLoading={loading}
        />

        {/* Seletor de visualização */}
        <View style={styles.displaySelector}>
          <ChooseDisplay
            onSetOpenParcelas={setOpenParcelas}
            isOpenParcelas={openParcelas}
            showInstallmentsOption={selectedCategoryGUID === GENERAL_CATEGORY_GUID}
          />
        </View>

        {/* Lista de despesas */}
        <View style={styles.listContainer}>
          {openParcelas ? (
            installmentsMonth.length > 0 ? (
              <FlatList
                data={installmentsMonth}
                renderItem={renderInstallments}
                keyExtractor={(item) => item.guid}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <EmptyState />
            )
          ) : (
            daysList.length > 0 ? (
              <FlatList
                data={daysList}
                renderItem={renderDay}
                keyExtractor={(item) => `day-${item.date}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <EmptyState />
            )
          )}
        </View>

        {/* Footer com contexto */}
        <FooterContext
          paymentMethod={paymentMethod}
          onPaymentMethodChange={handlePaymentMethod}
          categoryTotal={spentInTheMounth}
          categoryName={getCategoryName()}
          selectedCategoryGUID={selectedCategoryGUID}
        />
      </View>

      {/* Footer */}
      <FooterApp onDateChange={setMonthYearOfExpenses} />

      {/* Modais */}
      {openModalPaymentMethod && (
        <ModalPaymentMethod
          modalVisible={openModalPaymentMethod}
          onClose={() => setOpenModalPaymentMethod(false)}
          onSelectPaymentMethod={handleSelectPaymentMethod}
        />
      )}

      {openModalExpense && (
        <ModalExpense
          modalVisible={openModalExpense}
          onClose={() => setOpenModalExpense(false)}
          onAddExpense={handleAddExpense}
          paymentMethod={paymentMethod}
          monthYear={monthYearOfExpenses}
          categoryGUID={selectedCategoryGUID || ''}
        />
      )}

      {openModalAppSettings && (
        <ModalFull
          isVisible={openModalAppSettings}
          onClose={() => setOpenModalAppSettings(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  
  displaySelector: {
    marginVertical: spacing.md,
  },
  
  listContainer: {
    flex: 1,
    marginTop: spacing.sm,
  },
  
  listContent: {
    paddingBottom: spacing.lg,
    paddingTop: spacing.xs,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },

  emptyIcon: {
    marginBottom: spacing.lg,
    opacity: 0.6,
  },

  emptyTitle: {
    marginBottom: spacing.sm,
    color: colors.text.secondary,
  },

  emptyDescription: {
    marginBottom: spacing.xl,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },

  addButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },

  addButtonText: {
    marginLeft: spacing.sm,
    color: colors.text.inverse,
  },
});