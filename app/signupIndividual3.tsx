import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { db } from "@/constants/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function SignUpIndividual3() {
  const router = useRouter();

  // PEGAR O UID DA TELA ANTERIOR
  const { uid } = useLocalSearchParams();

  const areas = [
    "Constitucional",
    "Civil",
    "Penal",
    "Trabalhista",
    "Tributário",
    "Previdenciário",
    "Empresarial",
  ];

  const [selecionadas, setSelecionadas] = useState<string[]>([]);

  const toggleArea = (area: string) => {
    setSelecionadas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
    );
  };

  // FUNÇÃO PARA SALVAR E IR PARA A TELA 4
  const salvarEAvancar = async () => {
    if (!uid) {
      alert("Erro: UID não encontrado.");
      return;
    }

    if (selecionadas.length === 0) {
      alert("Selecione pelo menos uma área.");
      return;
    }

    try {
      const userRef = doc(db, "usuariosApp", String(uid));

      await updateDoc(userRef, {
        areasInteresse: selecionadas,
      });

      // IR PARA A TELA 4 COM UID
      router.push({
        pathname: "/signupIndividual4",
        params: { uid },
      });
    } catch (error) {
      console.log("Erro ao salvar áreas:", error);
      alert("Erro ao salvar áreas. Tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() =>
                  router.push({
                    pathname: "/signupIndividual2",
                    params: { uid },
                  })
                }
              >
                <FontAwesome name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>

              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Card */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Escolha suas áreas de interesse</Text>
              <Text style={styles.subtitle}>
                Selecione as áreas jurídicas que são relevantes para você. Você
                pode escolher mais de uma.
              </Text>

              {areas.map((item) => {
                const selected = selecionadas.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={styles.areaItem}
                    onPress={() => toggleArea(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.areaText}>{item}</Text>
                    <View
                      style={[
                        styles.circle,
                        selected && styles.circleSelected,
                      ]}
                    >
                      {selected && <View style={styles.innerCircle} />}
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* Footer */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.roundButton}
                  onPress={() =>
                    router.push({
                      pathname: "/signupIndividual2",
                      params: { uid },
                    })
                  }
                >
                  <FontAwesome name="arrow-left" size={26} color="#fff" />
                </TouchableOpacity>

                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                </View>

                <TouchableOpacity
                  style={styles.roundButton}
                  onPress={salvarEAvancar}
                >
                  <FontAwesome name="arrow-right" size={26} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#001640" },
  header: { flex: 0.15, alignItems: "center" },
  backButton: { position: "absolute", top: 50, left: 20 },
  logo: { marginTop: 10, width: 150, height: 150 },
  formContainer: {
    flex: 0.85,
    backgroundColor: "#EEF0F2",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    color: "#001640",
  },
  subtitle: {
    fontSize: 16,
    color: "#211611",
    textAlign: "center",
    marginBottom: 40,
  },
  areaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  areaText: { fontSize: 16, color: "#001640" },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  circleSelected: {
    borderColor: "#001640",
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#001640",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 40,
    paddingHorizontal: 10,
  },
  roundButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F10A2D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ccc",
    marginHorizontal: 15,
    overflow: "hidden",
  },
  progressFill: {
    width: "75%",
    height: "100%",
    backgroundColor: "#001640",
    borderRadius: 6,
  },
});
