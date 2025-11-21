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
    View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  // estado do email
  const [email, setEmail] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* Topo azul com logo e seta */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push("/login")}
              >
                <FontAwesome name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>

              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Card cinza */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Esqueceu a senha?</Text>
              <Text style={styles.subtitle}>
                Digite o e-mail associado à sua conta e enviaremos um link para
                redefinir sua senha.
              </Text>

              {/* Campo email */}
              <IconInputField
                label=""
                placeholder="E-mail cadastrado"
                iconName="envelope"
                value={email}
                onChangeText={setEmail}
              />

              {/* Botão */}
              <TouchableOpacity style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Enviar link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001640", // fundo azul
  },
  header: {
    flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  logo: {
    width: 150,
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
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    color: "#001640",
  },
  subtitle: {
    fontSize: 14,
    color: "#211611",
    textAlign: "center",
    marginBottom: 30,
  },
  sendButton: {
    backgroundColor: "#001640",
    width: "100%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
