import { LinearGradient } from "expo-linear-gradient";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
// import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const colorBlue = '#052BC2';
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"}  backgroundColor="#02145C" />
      <View style={styles.headerContainer}>
        <LinearGradient colors={['#02145C', '#052BC2']} style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', height: 30 }}>
            <Ionicons name="ellipsis-horizontal" size={50} color="#fff" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, paddingBottom: 4 }}>
            <View style={{ paddingStart: 40 }}>
              <Text style={{ color: '#fff' }}>M 2.000,00</Text>
              <Text style={{ color: '#fff' }}>D 100,00</Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 24 }}>R$ 50.000,00</Text>
          </View>
        </LinearGradient>
      </View>
      <View style={styles.cardHeader}>
        <View style={{ backgroundColor: '#000', borderRadius: '100%', padding: 14 }}>
          <Ionicons name="add" size={40} color='#fff' />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', height: 70, alignItems: "center", justifyContent: 'center', backgroundColor: '#000', borderTopStartRadius: 50, borderBottomStartRadius: 50 }}>
          <View style={{ flex: 1, alignItems: 'flex-start', paddingStart: 20 }}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </View>
          <Text style={{ fontSize: 18, color: '#fff', flex: 1, textAlign: 'center' }}>Geral</Text>
          <View style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 20 }}>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.cardContent}>
            <View style={{ backgroundColor: '#000', height: 12, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}></View>
            <View style={styles.mainContent}>
              <View style={styles.dateContainer}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'green', backgroundColor: '#fff', paddingHorizontal: 8, borderRadius: 6 }}>D 100,00</Text>
                <Text style={{ fontSize: 16, color: '#fff' }}>14/01</Text>
              </View>

              <View style={styles.valueContainer}>
                <Text style={{ fontSize: 20, color: colorBlue }}><Text style={{ fontSize: 14 }}>R$</Text> 50,00</Text>
                <Text style={{ fontSize: 16, color: 'gray' }}>01 de 10</Text>
                <Text style={{ fontSize: 16, color: 'gray' }}>Carregador</Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ height: 6, width: 40, backgroundColor: 'rgba(211, 211, 211, 0.8)', borderRadius: 6 }}></View>
              </View>
              <View style={styles.valueContainer}>
                <Text style={{ fontSize: 20, color: colorBlue }}><Text style={{ fontSize: 14 }}>R$</Text> 50,00</Text>
                <Text style={{ fontSize: 30, fontWeight: "bold" }}></Text>
              </View>

              <View style={styles.dateContainer}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'red', backgroundColor: '#fff', paddingHorizontal: 8, borderRadius: 6 }}>D 137,30</Text>
                <Text style={{ fontSize: 16, color: '#fff' }}>12/01</Text>
              </View>


              <View style={styles.valueContainer}>
                <Text style={{ fontSize: 20, color: colorBlue }}><Text style={{ fontSize: 14 }}>R$</Text> 100,00</Text>
                <Text style={{ fontSize: 16, color: 'gray' }}>Fruteira</Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ height: 6, width: 40, backgroundColor: 'rgba(211, 211, 211, 0.8)', borderRadius: 6 }}></View>
              </View>
              <View style={styles.valueContainer}>
                <Text style={{ width: '33%', fontSize: 20, color: colorBlue }}><Text style={{ fontSize: 14 }}>R$</Text> 20,50</Text>
                <Text style={{ width: '33%', fontSize: 16, color: 'gray', textAlign: 'center' }}>03 de 05</Text>
                <Text style={{ width: '33%', fontSize: 16, color: 'gray' }}></Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ height: 6, width: 40, backgroundColor: 'rgba(211, 211, 211, 0.8)', borderRadius: 6 }}></View>
              </View>
              <View style={styles.valueContainer}>
                <Text style={{ fontSize: 20, color: colorBlue }}><Text style={{ fontSize: 14 }}>R$</Text> 16,80</Text>
                <Text style={{ fontSize: 16, color: 'gray' }}>-</Text>
              </View>
            </View>
          </View>
        </View>

      </View>
      <View style={styles.footerContent}>
        <View style={{ height: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', flex: 1, borderTopRightRadius: 100, borderBottomRightRadius: 100, padding: 4, paddingHorizontal: 12 }}>
          <Text style={{ fontSize: 20 }}>Total</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 14 }}>R$</Text>
            <Text style={{ fontSize: 30, color: colorBlue, textAlign: 'right' }}>100</Text>
          </View>
        </View>

        <View style={{ backgroundColor: colorBlue, borderRadius: '100%', padding: 14 }}>
          <Ionicons name="add" size={40} color='#fff' />
        </View>
      </View>
      <View style={styles.footerContainer}>
        <View style={{ flex: 1, alignItems: 'flex-start', paddingStart: 20 }}>
          <Ionicons name="chevron-back" size={40} color={colorBlue} />
        </View>
        <Text style={{ fontSize: 18, color: '#000', flex: 1, textAlign: 'center' }}>JAN/2025</Text>
        <View style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 20 }}>
          <Ionicons name="chevron-forward" size={40} color={colorBlue} />
        </View>
      </View>
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
  headerContainer: {
    width: '100%',
    borderBottomLeftRadius: 50
  },
  gradientContainer: {
    height: 80,
    width: '100%',
    paddingHorizontal: 8,
    borderBottomLeftRadius: 50
  },
  contentContainer: {
    flex: 1,
    // gap: 4,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    width: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 50
  },
  cardContainer: {
    flex: 1
  },
  cardHeader: {
    // alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // minHeight: 70,
    width: '100%',
    paddingStart: 8
  },
  cardContent: {
    // height: 230,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    // backgroundColor: '#052BC2',
    // backgroundColor: '#fff',
    // paddingTop: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 50
  },
  mainContent: {
    flex: 1,
    gap: 2,
    backgroundColor: '#fff',
    borderBottomRightRadius: 50
    // padding: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 28,
    backgroundColor: '#052BC2',
    paddingHorizontal: 4,
    justifyContent: "space-between",
    alignItems: "center"
  },
  valueContainer: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 50,
    justifyContent: "space-between",
    alignItems: 'center',
    paddingHorizontal: 8,
    // borderBottomWidth: 1,
    // borderColor: '#052BC2',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  footerContent: {
    // borderTopWidth: 2,
    // borderTopColor: '#052bc2',
    // height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    gap: 8,
    paddingEnd: 8
    // paddingHorizontal: 14,
  }
})