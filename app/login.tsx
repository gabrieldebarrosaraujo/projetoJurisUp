import IconInputField from "@/components/IconInputField";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  View
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../constants/firebase"; // 🔥 IMPORTAÇÃO CORRETA DO SEU PROJETO

export default function LoginScreen() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  // -----------------------
  // FUNÇÃO DE LOGIN FIREBASE
  // -----------------------
  const handleLogin = async () => {
    if (!login || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);

      // Login com email e senha
      const userCredential = await signInWithEmailAndPassword(auth, login, senha);
      const user = userCredential.user;

      console.log("Usuário logado:", user.uid);

      // Redireciona para Home
      router.replace("/home");

    } catch (error) {
      console.log("Erro no login:", error);
      alert("Email ou senha incorretos.");
    } finally {
      setLoading(false);
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
            <View style={styles.header}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>Bem-vindo de volta!</Text>
              <Text style={styles.subtitle}>
                Entre para acessar suas atualizações jurídicas.
              </Text>

              {/* Campo Login */}
              <IconInputField
                label="Email"
                placeholder="Digite seu email"
                iconName="envelope"
                value={login}
                onChangeText={setLogin}
              />

              {/* Campo Senha */}
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

              {/* Esqueceu senha */}
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => router.push("/forgotPasswordScreen")}
              >
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              {/* BOTÃO LOGIN */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? "Entrando..." : "Entrar"}
                </Text>
              </TouchableOpacity>

              {/* Ir para cadastro */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Não tem conta? </Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text style={styles.signupLink}>Cadastre-se</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// -----------------------
// ESTILOS
// -----------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001640",
  },
  header: {
    flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 180,
    height: 120,
  },
  formContainer: {
    flex: 0.75,
    backgroundColor: "#EEF0F2",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#001640",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#211611",
    marginBottom: 30,
    textAlign: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 42,
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 5,
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: "#001640",
    fontSize: 13,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#001640",
    width: "100%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
  },
  signupText: {
    fontSize: 14,
    color: "#211611",
  },
  signupLink: {
    fontSize: 14,
    color: "#F10A2D",
    fontWeight: "bold",
  },
});
