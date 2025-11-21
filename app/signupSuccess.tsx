import { useRouter } from "expo-router";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SignUpSuccess() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Cabeçalho azul */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Card cinza */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Conta criada com sucesso!</Text>
        <Text style={styles.subtitle}>Bem-vindo(a) ao JurisUp</Text>

        {/* Imagem */}
        <Image
          source={require("../assets/images/pronto.png")}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Texto final */}
        <Text style={styles.finalTitle}>Tudo pronto!</Text>
        <Text style={styles.finalText}>
          Seu cadastro foi finalizado e você já pode começar a usar o JurisUp
          para receber as atualizações jurídicas de seu interesse.
        </Text>

        {/* Botão para login */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Ir para tela inicial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#001640" },
  header: { flex: 0.2, alignItems: "center", justifyContent: "center" },
  logo: { width: 150, height: 150 },
  formContainer: {
    flex: 0.8,
    backgroundColor: "#EEF0F2",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#001640",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },
  finalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#001640",
    marginBottom: 10,
    marginTop: -60, 
    textAlign: "center",
  },
  finalText: {
    fontSize: 14,
    color: "#211611",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#001640",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
