import IconInputField from "@/components/IconInputField";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
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

// 🔥 IMPORTAÇÕES DO FIREBASE
import { auth, db } from "@/constants/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignUpIndividual1() {
  const router = useRouter();

  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  // 👉 FUNÇÃO PARA CRIAR USUÁRIO + SALVAR NO FIRESTORE
  const handleContinue = async () => {
    if (!cpf || !email || !senha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Atenção", "As senhas não coincidem.");
      return;
    }

    try {
      // 1️⃣ Criar usuário no AUTH
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

      const user = userCredential.user;

      // 2️⃣ Salvar dados no Firestore
      await setDoc(doc(db, "usuariosApp", user.uid), {
        cpf: cpf,
        email: email,
        etapa: 1, // você pode controlar em qual tela está
        createdAt: new Date(),
      });

      router.push({
  pathname: "/signupIndividual2",
  params: { uid: user.uid },
 });


    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível criar o cadastro.");
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
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push("/signup")}
              >
                <FontAwesome name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>

              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Cadastro Individual</Text>

              <Text style={styles.subtitle}>
                Para sua segurança, vamos começar com alguns dados básicos.
              </Text>

              <IconInputField
                label="CPF"
                placeholder="Digite seu CPF"
                iconName="id-card"
                value={cpf}
                onChangeText={setCpf}
              />

              <IconInputField
                label="Email"
                placeholder="Digite seu email"
                iconName="envelope"
                value={email}
                onChangeText={setEmail}
              />

              <View style={{ width: "100%" }}>
                <IconInputField
                  label="Senha"
                  placeholder="Digite sua senha"
                  iconName="lock"
                  value={senha}
                  secureTextEntry={!showSenha}
                  onChangeText={setSenha}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowSenha(!showSenha)}
                >
                  <FontAwesome
                    name={showSenha ? "eye-slash" : "eye"}
                    size={20}
                    color="#3C3C4340"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.regras}>
                * Use no mínimo 8 caracteres com letras, números e símbolos.
              </Text>

              <View style={{ width: "100%" }}>
                <IconInputField
                  label="Confirmar senha"
                  placeholder="Confirme sua senha"
                  iconName="lock"
                  value={confirmarSenha}
                  secureTextEntry={!showConfirmarSenha}
                  onChangeText={setConfirmarSenha}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}
                >
                  <FontAwesome
                    name={showConfirmarSenha ? "eye-slash" : "eye"}
                    size={20}
                    color="#3C3C4340"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <TouchableOpacity style={styles.roundButton}>
                  <FontAwesome name="arrow-left" size={26} color="#fff" />
                </TouchableOpacity>

                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                </View>

                <TouchableOpacity
                  style={styles.roundButton}
                  onPress={handleContinue}
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

// estilos permanecem iguais...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001640",
  },
  header: {
    flex: 0.15,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  logo: {
    marginTop: 10,
    width: 150,
    height: 150,
  },
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
  regras: {
    fontSize: 10,
    color: "#0069AD",
    textAlign: "left",
    width: "100%",
    marginBottom: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 40,
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
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  progressFill: {
    width: "25%",
    height: "100%",
    backgroundColor: "#001640",
    borderRadius: 6,
  },
});
