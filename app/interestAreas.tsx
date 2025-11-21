import { db } from "@/constants/firebase";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AREAS = [
  "Constitucional",
  "Civil",
  "Penal",
  "Trabalhista",
  "Tributário",
  "Previdenciário",
  "Empresarial",
  "Ambiental",
];

export default function InterestAreas() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  // Puxar áreas já salvas no cadastro
  useEffect(() => {
    if (!user) return;

    const fetchUserAreas = async () => {
      try {
        const docRef = doc(db, "usuariosApp", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSelectedAreas(data.areaInteresse || []); 
        }
      } catch (error) {
        console.error("Erro ao buscar áreas do usuário:", error);
      }
    };

    fetchUserAreas();
  }, [user]);

  // Alterna seleção mas não salva ainda
  const toggleArea = (area: string) => {
    let newSelection: string[];
    if (selectedAreas.includes(area)) {
      newSelection = selectedAreas.filter((a) => a !== area);
    } else {
      newSelection = [...selectedAreas, area];
    }
    setSelectedAreas(newSelection);
  };

  // Salva alterações e só depois redireciona
  const salvarAlteracoes = async () => {
    if (!user) return;

    try {
      await setDoc(
        doc(db, "usuariosApp", user.uid),
        { areaInteresse: selectedAreas },
        { merge: true }
      );
      Alert.alert("Sucesso", "Áreas de interesse atualizadas!");
      router.push("/home"); // Redireciona para a Home
    } catch (error) {
      console.error("Erro ao salvar áreas:", error);
      Alert.alert("Erro", "Não foi possível salvar as áreas. Tente novamente.");
    }
  };

  return (
    <LinearGradient
      colors={["#001640", "#ffffff"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.25 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#001640" />
        </TouchableOpacity>
        <Text style={styles.title}>Áreas de interesse</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Áreas de interesse</Text>

        <FlatList
          data={AREAS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.areaItem}
              onPress={() => toggleArea(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.areaText}>{item}</Text>
              <View
                style={[
                  styles.circle,
                  selectedAreas.includes(item)
                    ? styles.activeCircle
                    : styles.inactiveCircle,
                ]}
              />
            </TouchableOpacity>
          )}
        />

        {/* Botão Salvar */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={salvarAlteracoes}
        >
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 50, alignItems: "center", position: "relative" },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 8,
    backgroundColor: "#E8EBF0",
    borderRadius: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#001640" },
  content: { marginTop: 40, flex: 1 },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#001640",
    marginBottom: 15,
  },
  areaItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  areaText: { fontSize: 15, color: "#000" },
  circle: { width: 18, height: 18, borderRadius: 9 },
  activeCircle: { backgroundColor: "#F10A2D" },
  inactiveCircle: { backgroundColor: "#D9D9D9" },
  saveButton: {
    backgroundColor: "#F10A2D",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
