import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconButton from "../components/IconButton";


export default function SignUp() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo na parte azul */}
      <View style={styles.header}>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
    
        <Image 
          source={require("../assets/images/logo.png")} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Card cinza sobre o fundo azul */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          <Text style={styles.juris}>Crie a sua conta Juris</Text>
          <Text style={styles.up}>UP</Text>
        </Text>

        <Text style={styles.subtitle}>
          Cadastre-se para se manter atualizado(a) com a legislação.
        </Text>

        <Text style={styles.question}>Clique na opção a seguir para prosseguir!</Text>

        <IconButton 
          title="Cadastro Individual" 
          iconName={'user-o'} 
          onPress={() => router.push("/signupIndividual1")} 
        />

       
      </View>
    </View>
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
  },
  backButton: {
    position: "absolute",
    top: 50, // ajusta conforme o notch/statusbar
    left: 20,
  },
  logo: { 
    width: 280, 
    height: 280,
  },
  formContainer: {
    flex: 0.75,
    backgroundColor: "#EEF0F2", // bloco cinza
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
  },
  juris: { color: "#001640" },
  up: { color: "#F10A2D" },
  subtitle: { 
    fontSize: 16, 
    color: "#211611", 
    textAlign: "center", 
    marginBottom: 40,
  },
  question: {
    fontSize: 16,
    color: "#211611",
    textAlign: "center",
    marginBottom: 60,
  },
});