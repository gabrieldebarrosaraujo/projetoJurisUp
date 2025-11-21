import { auth, db } from "@/constants/firebase";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

export default function EditNotificationsScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [daily, setDaily] = useState(false);
  const [weekly, setWeekly] = useState(true);
  const [monthly, setMonthly] = useState(false);
  const [appNoti, setAppNoti] = useState(true);
  const [emailNoti, setEmailNoti] = useState(false);

  // Puxar preferências salvas
  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      try {
        const docRef = doc(db, "usuariosApp", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data()?.notificacoes || {};
          setDaily(data.diaria ?? false);
          setWeekly(data.semanal ?? false);
          setMonthly(data.mensal ?? false);
          setAppNoti(data.app ?? true);
          setEmailNoti(data.email ?? false);
        }
      } catch (error) {
        console.error("Erro ao buscar preferências:", error);
      }
    };

    fetchPreferences();
  }, [user]);

  // Salvar preferências
  const salvarPreferencias = async () => {
    if (!user) return;

    try {
      await setDoc(
        doc(db, "usuariosApp", user.uid),
        {
          notificacoes: {
            diaria: daily,
            semanal: weekly,
            mensal: monthly,
            app: appNoti,
            email: emailNoti,
          },
        },
        { merge: true }
      );
      Alert.alert("Sucesso", "Preferências de notificação atualizadas!");
      router.back();
    } catch (error) {
      console.error("Erro ao salvar notificações:", error);
      Alert.alert("Erro", "Não foi possível salvar suas preferências.");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f4f6fb" }}>
      <LinearGradient colors={["#001640", "#ffffff"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notificações</Text>
        </View>
      </LinearGradient>

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Frequência de notificações</Text>
        {[
          { label: "Diária", value: daily, setValue: setDaily },
          { label: "Semanal", value: weekly, setValue: setWeekly },
          { label: "Mensal", value: monthly, setValue: setMonthly },
        ].map((item) => (
          <View key={item.label} style={styles.row}>
            <Text style={styles.text}>{item.label}</Text>
            <Switch
              value={item.value}
              onValueChange={item.setValue}
              trackColor={{ true: "#F10A2D" }}
              thumbColor={item.value ? "#fff" : "#f4f3f4"}
            />
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Tipo de notificação</Text>
        <View style={styles.row}>
          <Checkbox value={appNoti} onValueChange={setAppNoti} color={appNoti ? "#F10A2D" : undefined} />
          <Text style={styles.text}>Notificação do app</Text>
        </View>
        <View style={styles.row}>
          <Checkbox value={emailNoti} onValueChange={setEmailNoti} color={emailNoti ? "#F10A2D" : undefined} />
          <Text style={styles.text}>Notificação por e-mail</Text>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.saveButton} onPress={salvarPreferencias}>
          <Text style={styles.saveButtonText}>Salvar</Text>
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
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 10, color: "#1c1c1c" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  text: { fontSize: 15, color: "#333", marginLeft: 8 },
  saveButton: {
    backgroundColor: "#F10A2D",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
