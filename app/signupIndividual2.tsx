import IconInputField from "@/components/IconInputField";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
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

// IMPORTS DO FIREBASE
import { db } from "@/constants/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function SignUpIndividual2() {
  const router = useRouter();
  const { uid } = useLocalSearchParams(); // recebendo o UID

  // estados dos inputs
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [genero, setGenero] = useState("");

  // função para formatar celular
  const formatarCelular = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 10)
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  // SALVAR NO FIREBASE
  const salvarDados = async () => {
    if (!uid) {
      alert("Erro: UID não encontrado.");
      return;
    }

    try {
      const usuarioRef = doc(db, "usuariosApp", String(uid));

      await updateDoc(usuarioRef, {
        nome,
        celular,
        dataNascimento: dataNascimento ? dataNascimento.toISOString() : null,
        genero,
      });

      router.push({
        pathname: "/signupIndividual3",
        params: { uid },
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar dados.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Logo */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push("/signupIndividual1")}
              >
                <FontAwesome name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>

              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Formulário */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Fale um pouco sobre você</Text>

              <Text style={styles.subtitle}>
                Precisamos de mais algumas informações para personalizar sua experiência.
              </Text>

              {/* Nome Completo */}
              <IconInputField
                label="Nome Completo"
                placeholder="Digite seu nome completo"
                iconName="user-o"
                value={nome}
                onChangeText={setNome}
              />

              {/* Celular */}
              <IconInputField
                label="Celular"
                placeholder="(__) _____-____"
                iconName="mobile"
                value={celular}
                onChangeText={(text) => setCelular(formatarCelular(text))}
              />

              {/* Data de nascimento e gênero */}
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.inputBox, { flex: 1 }]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.label}>Data de Nascimento</Text>
                  <Text style={styles.textValue}>
                    {dataNascimento
                      ? dataNascimento.toLocaleDateString("pt-BR")
                      : "DD/MM/AAAA"}
                  </Text>
                </TouchableOpacity>

                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.label}>Gênero</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={genero}
                      onValueChange={(itemValue) => setGenero(itemValue)}
                      style={styles.picker}
                      dropdownIconColor="#fff"
                    >
                      <Picker.Item label="Selecione" value="" />
                      <Picker.Item label="Masculino" value="masculino" />
                      <Picker.Item label="Feminino" value="feminino" />
                      <Picker.Item label="Não Binário" value="nao-binario" />
                    </Picker>
                  </View>
                </View>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={dataNascimento || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDataNascimento(selectedDate);
                  }}
                />
              )}

              {/* Footer */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.roundButton}
                  onPress={() => router.push("/signupIndividual1")}
                >
                  <FontAwesome name="arrow-left" size={26} color="#fff" />
                </TouchableOpacity>

                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                </View>

                <TouchableOpacity style={styles.roundButton} onPress={salvarDados}>
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
  row: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  inputBox: { marginBottom: 20, marginHorizontal: 5 },
  label: { fontSize: 14, fontWeight: "bold", color: "#001640", marginBottom: 6 },
  textValue: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#78788014",
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#001640",
  },
  pickerWrapper: {
    backgroundColor: "#263950B5",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    color: "#fff",
    width: "100%",
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
    width: "50%",
    height: "100%",
    backgroundColor: "#001640",
    borderRadius: 6,
  },
});
