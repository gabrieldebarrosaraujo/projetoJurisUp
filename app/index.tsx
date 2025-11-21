import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

export default function SplashScreen() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          router.replace("/home"); // usuário autenticado → home
        } else {
          // se não tiver token, fica na splash mesmo
          setIsCheckingAuth(false);
        }
      } catch (e) {
        console.log("Erro ao verificar autenticação:", e);
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/logo_splash.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Sua lei em dia!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo_splash.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Sua lei em dia!</Text>
      <Text style={styles.subtitle}>
        Com o JurisUp, você recebe notificações, cria relatórios e faz consultas
        sobre mudanças em leis e súmulas, tudo de forma simplificada
      </Text>

      <PrimaryButton
        title="Cadastre-se"
        onPress={() => router.push("/signup")}
      />

      <Text style={styles.linkText}>
        Já tem conta?{" "}
        <Text style={styles.entrar} onPress={() => router.push("/login")}>
          Entrar
        </Text>
      </Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  logo: { width: 300, height: 300, marginBottom: 50 },
  title: { fontSize: 40, fontWeight: "bold", marginBottom: 20, color: "#001640" },
  subtitle: { textAlign: "center", fontSize: 14, color: "#211611", marginBottom: 30 },
  linkText: { fontSize: 14, marginTop: 20, color: "#211611" },
  entrar: { color: "#F10A2D" },
});
