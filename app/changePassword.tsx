import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!user || !user.email) return;

    if (newPass !== confirm) {
      Alert.alert("Erro", "A nova senha e a confirmação não coincidem.");
      return;
    }

    if (newPass.length < 8) {
      Alert.alert("Erro", "A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // Reautenticar usuário com senha atual
      const credential = EmailAuthProvider.credential(user.email, current);
      await reauthenticateWithCredential(user, credential);

      // Atualizar senha
      await updatePassword(user, newPass);

      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      router.back();
    } catch (error: any) {
      console.error("Erro ao mudar senha:", error);
      let message = "Não foi possível alterar a senha. Tente novamente.";
      if (error.code === "auth/wrong-password") message = "Senha atual incorreta.";
      if (error.code === "auth/weak-password") message = "A nova senha é muito fraca.";
      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f4f6fb" }}>
      <LinearGradient colors={["#001640", "#ffffff"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Senha</Text>
        </View>
      </LinearGradient>

      <View style={styles.container}>
        <Text style={styles.title}>Mudar senha</Text>

        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Senha atual"
            secureTextEntry
            value={current}
            onChangeText={setCurrent}
          />
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            secureTextEntry
            value={newPass}
            onChangeText={setNewPass}
          />
        </View>
        <Text style={styles.helper}>* Use no mínimo 8 caracteres com letras, números e símbolos.</Text>

        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Alterando..." : "Salvar"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { height: 100, justifyContent: "flex-end", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerContent: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 10 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  container: { backgroundColor: "#fff", margin: 20, padding: 20, borderRadius: 16, elevation: 3 },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 15 },
  inputRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderColor: "#ddd", marginBottom: 15 },
  input: { flex: 1, height: 40, fontSize: 15 },
  helper: { color: "#007AFF", fontSize: 12, marginBottom: 15 },
  button: { backgroundColor: "#F10A2D", borderRadius: 8, paddingVertical: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
