import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { db } from "@/constants/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function LawListScreen() {
  const { area } = useLocalSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [leis, setLeis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (area) carregarLeis(area as string);
  }, [area]);

  const carregarLeis = async (areaSelecionada: string) => {
    try {
      const ref = collection(db, "leis");
      const q = query(ref, where("area", "==", areaSelecionada));

      const snap = await getDocs(q);
      const lista: any[] = [];

      snap.forEach((docSnap) => {
        const data = docSnap.data();

        lista.push({
          id: docSnap.id,
          titulo: data.titulo,
          data: data.data?.toDate ? data.data.toDate().toLocaleDateString("pt-BR") : "",
          area: data.area,
          numero: data.numero,
          tipo: data.naturezaJuridica,
          resumo: data.resumo,
          hasUpdate: !!data.dataUltimaAtualizacao,
        });
      });

      setLeis(lista);
    } catch (err) {
      console.error("Erro ao carregar leis:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = leis.filter(
    (law) =>
      law.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      law.numero?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LinearGradient
      colors={["#001640", "#ffffff"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.28 }}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={18} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={styles.areaTitle}>{area}</Text>

        {/* Campo de busca */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Pesquisar leis"
            placeholderTextColor="#151C2A5C"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          <FontAwesome name="search" size={18} color="#000" style={styles.searchIcon} />
        </View>
      </View>

      {/* Lista */}
      {loading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" color="#001640" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.lawItem}
              onPress={() =>
                router.push({
                  pathname: "/lawDetail",
                  params: { id: item.id },
                })
              }
            >
              <View>
                <Text style={styles.lawTitle}>{item.titulo}</Text>
                <Text style={styles.lawDate}>{item.data}</Text>
              </View>

              <View style={styles.rightIcons}>
                {item.hasUpdate && <View style={styles.dot} />}
                <FontAwesome name="arrow-right" size={16} color="#F10A2D" />
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    alignItems: "center",
    paddingTop: 50,
  },
  logo: { width: 160, height: 60 },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginTop: 15,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#00164033",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  areaTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#001640",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 28,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0016400D",
    borderRadius: 10,
    marginTop: 15,
    width: "90%",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: "#000",
  },
  searchIcon: { marginLeft: 6 },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 15,
  },

  lawItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  lawTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#001640",
  },
  lawDate: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFCC00",
  },

  separator: {
    height: 1,
    backgroundColor: "#ccc",
    opacity: 0.4,
  },
});
