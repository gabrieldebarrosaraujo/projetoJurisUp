import { auth, db } from "@/constants/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { deleteUser } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

export default function DesativarConta() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;

  const handleDesativar = async () => {
    if (!user) return;

    try {
      // Apaga dados do Firestore
      await deleteDoc(doc(db, "usuariosApp", user.uid));

      // Apaga a conta do Firebase Auth
      await deleteUser(user);

      // Limpa token local
      await AsyncStorage.removeItem("token");

      Alert.alert("Conta desativada", "Sua conta foi excluída com sucesso!");
      setModalVisible(false);
      router.replace("/"); // volta para tela inicial
    } catch (e: any) {
      console.log("Erro ao desativar conta:", e);
      if (e.code === "auth/requires-recent-login") {
        Alert.alert(
          "Sessão expirada",
          "Para desativar a conta, faça login novamente."
        );
        router.replace("/login"); // redireciona pro login
      } else {
        Alert.alert("Erro", "Não foi possível desativar a conta. Tente novamente.");
      }
    }
  };

  return (
    <LinearGradient
      colors={["#ffffff", "#e6e9ff"]}
      style={styles.container}
    >
      <Text style={styles.title}>Desativar Conta</Text>
      <Text style={styles.subtitle}>
        Ao desativar sua conta, seus dados serão apagados e será necessário se
        cadastrar novamente.
      </Text>

      <PrimaryButton
        title="Desativar conta"
        onPress={() => setModalVisible(true)}
      />

      {/* MODAL DE CONFIRMAÇÃO */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Tem certeza?</Text>
            <Text style={styles.modalText}>
              Deseja realmente desativar sua conta?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Não</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDesativar}
              >
                <Text style={styles.confirmText}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#001640",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#001640",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  confirmButton: {
    backgroundColor: "#F10A2D",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
