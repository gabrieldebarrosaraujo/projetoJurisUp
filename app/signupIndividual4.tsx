import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox, RadioButton } from "react-native-paper";

import { db } from "@/constants/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function SignUpIndividual4() {
  const router = useRouter();
  const { uid } = useLocalSearchParams(); // PEGAMOS O UID DA TELA 3

  const [frequencia, setFrequencia] = useState("");
  const [notificacaoApp, setNotificacaoApp] = useState(false);
  const [notificacaoEmail, setNotificacaoEmail] = useState(false);

  const concluirCadastro = async () => {
    if (!uid) {
      alert("Erro: UID não encontrado.");
      return;
    }

    if (!frequencia) {
      alert("Selecione uma frequência.");
      return;
    }

    try {
      const userRef = doc(db, "usuariosApp", String(uid));

      await updateDoc(userRef, {
        configuracoesNotificacao: {
          frequencia,
          notificacaoApp,
          notificacaoEmail,
        },
      });

      // Navegar para a tela de sucesso
      router.push({
        pathname: "/signupSuccess",
        params: { uid },
      });

    } catch (error) {
      console.log("Erro ao salvar preferências:", error);
      alert("Erro ao concluir cadastro. Tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>

          <View style={styles.header}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>
              Como e quando você quer ser notificado(a)?
            </Text>
            <Text style={styles.subtitle}>
              Personalize a frequência e o tipo de notificação que você deseja
              receber do JurisUp.
            </Text>

            {/* FREQUÊNCIA */}
            <RadioButton.Group
              onValueChange={(value) => setFrequencia(value)}
              value={frequencia}
            >
              <View style={styles.radioRow}>
                <Text style={styles.radioLabel}>Diária</Text>
                <RadioButton value="diaria" />
              </View>
              <View style={styles.radioRow}>
                <Text style={styles.radioLabel}>Semanal</Text>
                <RadioButton value="semanal" />
              </View>
              <View style={styles.radioRow}>
                <Text style={styles.radioLabel}>Mensal</Text>
                <RadioButton value="mensal" />
              </View>
              <View style={styles.radioRow}>
                <Text style={styles.radioLabel}>Não desejo receber notificações</Text>
                <RadioButton value="nenhuma" />
              </View>
            </RadioButton.Group>

            {/* TIPOS DE NOTIFICAÇÃO */}
            <Text style={[styles.label, { marginTop: 20 }]}>
              Tipo de notificação
            </Text>

            <View style={styles.checkboxRow}>
              <Checkbox
                status={notificacaoApp ? "checked" : "unchecked"}
                onPress={() => setNotificacaoApp(!notificacaoApp)}
              />
              <Text style={styles.checkboxLabel}>Notificação do app</Text>
            </View>

            <View style={styles.checkboxRow}>
              <Checkbox
                status={notificacaoEmail ? "checked" : "unchecked"}
                onPress={() => setNotificacaoEmail(!notificacaoEmail)}
              />
              <Text style={styles.checkboxLabel}>Notificação por e-mail</Text>
            </View>

            {/* RODAPÉ */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() =>
                  router.push({
                    pathname: "/signupIndividual3",
                    params: { uid },
                  })
                }
              >
                <FontAwesome name="arrow-left" size={26} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roundButton, styles.finishButton]}
                onPress={concluirCadastro}
              >
                <FontAwesome name="check" size={20} color="#fff" />
                <Text style={styles.finishText}>Concluir</Text>
              </TouchableOpacity>
            </View>

            {/* PROGRESSO */}
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#001640" },
  header: { flex: 0.15, alignItems: "center" },
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
    fontSize: 24,
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#001640",
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  radioLabel: { fontSize: 16, color: "#000" },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  checkboxLabel: { fontSize: 16, color: "#000" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 40,
    paddingHorizontal: 10,
  },
  roundButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F10A2D",
    marginBottom: 10,
  },
  finishButton: {
    paddingHorizontal: 25,
  },
  finishText: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  progressBar: {
    width: "70%",
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ccc",
    marginTop: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressFill: {
    width: "100%",
    height: "100%",
    backgroundColor: "#001640",
    borderRadius: 6,
  },
});
