// Home.tsx - Atualização automática das leis com base nas áreas do usuário
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "@/constants/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [areasUsuario, setAreasUsuario] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Função para formatar datas do Firestore
  const formatDate = (data: any) => {
    if (!data) return "Sem data";
    if (data.toDate) return data.toDate().toLocaleDateString("pt-BR"); // Timestamp → Date
    if (data instanceof Date) return data.toLocaleDateString("pt-BR");  // já é Date
    return String(data);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "usuariosApp", user.uid);

    // Listener para alterações no usuário
    const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
      let userAreas: string[] = [];
      if (docSnap.exists()) {
        const data = docSnap.data();
        userAreas = Array.isArray(data.areaInteresse) ? data.areaInteresse : [];
      }
      setAreasUsuario(userAreas);

      // Listener para leis filtradas pelas áreas do usuário
      const unsubscribeLeis = onSnapshot(collection(db, "leis"), (snapAll) => {
        const listaFiltrada = snapAll.docs
          .map(d => ({ id: d.id, ...(d.data() as any) }))
          .filter(lei =>
            userAreas.length === 0
              ? true
              : userAreas.map(a => a.toLowerCase()).includes(String(lei.area ?? "").toLowerCase())
          );
        setUpdates(listaFiltrada);
        setLoading(false);
      });

      // Limpar listener das leis quando sair do listener do usuário
      return () => unsubscribeLeis();
    });

    // Limpar listener do usuário quando sair da tela
    return () => unsubscribeUser();
  }, []);

  const filteredAreasList = (areasUsuario || []).filter((area) =>
    area.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#001640" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#001640", "#ffffff"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.3 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header com logo */}
        <View style={styles.header}>
          <Image source={require("../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Saudação + ícones */}
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Olá</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.circleButton} onPress={() => router.push("/notifications")}>
              <FontAwesome name="bell" size={18} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleButton} onPress={() => router.push("/settings")}>
              <FontAwesome name="cog" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Texto "Atualizações" */}
        <Text style={styles.sectionTitle}>Atualizações</Text>

        {/* Carrossel */}
        <FlatList
          data={updates}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: "/lawDetail", params: { id: item.id } })}
            >
              <View style={styles.card}>
                <Text style={styles.area}>{item.area}</Text>
                <Text style={styles.date}>{formatDate(item.data)}</Text>
                <Text style={styles.law}>{item.titulo}</Text>
                <Text style={styles.description} numberOfLines={3}>
                  {item.resumo}
                </Text>
                <TouchableOpacity
                  style={styles.redButton}
                  onPress={() => router.push({ pathname: "/lawDetail", params: { id: item.id } })}
                >
                  <FontAwesome name="arrow-right" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / (width * 0.85));
            setActiveIndex(index);
          }}
          snapToInterval={width * 0.85 + 20}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContainer}
        />

        {/* Indicadores */}
        <View style={styles.dotsContainer}>
          {updates.map((_, index) => (
            <View key={index} style={[styles.dot, { backgroundColor: index === activeIndex ? "#8293B0" : "#ccc" }]} />
          ))}
        </View>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <TextInput placeholder="Áreas jurídicas" placeholderTextColor="#666" style={styles.searchInput} value={search} onChangeText={setSearch} />
          <FontAwesome name="search" size={18} color="#000" style={styles.searchIcon} />
        </View>

        {/* Lista de áreas do usuário */}
        <View style={styles.listContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredAreasList.length === 0 && (
              <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
                Nenhuma área de interesse encontrada.
              </Text>
            )}

            {filteredAreasList.map((item, index) => (
              <View key={item} style={styles.areaItem}>
                <Text style={styles.areaText}>{item}</Text>
                <View style={styles.itemRight}>
                  {index < 2 && <View style={styles.notificationDot} />}
                  <TouchableOpacity
                    style={styles.areaButton}
                    onPress={() => router.push({ pathname: "/lawList", params: { area: item } })}
                  >
                    <FontAwesome name="arrow-right" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// --- estilos permanecem iguais ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { marginTop: 50, alignItems: "center" },
  logo: { width: 160, height: 60 },
  greetingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 20, marginTop: 15 },
  greeting: { fontSize: 22, color: "#000" },
  name: { color: "#F10A2D", fontWeight: "bold" },
  iconRow: { flexDirection: "row", gap: 12 },
  circleButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#D9D9D9", justifyContent: "center", alignItems: "center" },
  sectionTitle: { fontSize: 15, color: "#151C2ADE", marginTop: 20, marginLeft: 20, fontWeight: "600" },
  carouselContainer: { paddingTop: 10, paddingBottom: 10 },
  card: { backgroundColor: "#001640", borderRadius: 12, width: width * 0.85, height: 180, padding: 20, alignSelf: "center", marginHorizontal: 10, marginTop: 10, position: "relative" },
  area: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  date: { color: "#fff", fontSize: 14, marginBottom: 6 },
  law: { color: "#F10A2D", fontWeight: "bold", marginBottom: 6 },
  description: { color: "#fff", fontSize: 12, lineHeight: 18 },
  redButton: { backgroundColor: "#F10A2D", width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center", position: "absolute", right: 15, top: "40%" },
  dotsContainer: { flexDirection: "row", justifyContent: "center", marginTop: 5, marginBottom: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 5 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#EEF0F2", borderRadius: 15, marginHorizontal: 20, marginTop: 10, paddingHorizontal: 10 },
  searchInput: { flex: 1, padding: 10, color: "#000" },
  searchIcon: { marginLeft: 5 },
  listContainer: { backgroundColor: "#EEF0F2", margin: 20, borderRadius: 15, padding: 10, height: 300 },
  areaItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, marginTop: 10, padding: 11 },
  areaText: { fontSize: 16, color: "#000" },
  itemRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  notificationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFCC00" },
  areaButton: { backgroundColor: "#F10A2D", width: 38, height: 38, borderRadius: 19, justifyContent: "center", alignItems: "center" },
});
