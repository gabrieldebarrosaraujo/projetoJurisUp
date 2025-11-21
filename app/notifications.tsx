import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../constants/firebase"; // Ajuste para seu caminho de config do Firebase

interface Notification {
  id: string;
  title: string;
  category: string;
  description: string;
  timestamp: any;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!auth.currentUser) return;

        // 1. Pegar áreas de interesse do usuário logado
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const interestAreas: string[] = userDoc.data()?.interestAreas || [];

        if (interestAreas.length === 0) return;

        // 2. Buscar últimas leis filtrando pelas áreas de interesse
        const q = query(
          collection(db, "laws"),
          where("category", "in", interestAreas),
          orderBy("timestamp", "desc"),
          limit(20)
        );

        const querySnapshot = await getDocs(q);
        const fetchedNotifications: Notification[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Notification[];

        setNotifications(fetchedNotifications);
      } catch (err) {
        console.log("Erro ao buscar notificações:", err);
      }
    };

    fetchNotifications();
  }, []);

  // Função para formatar timestamp
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Hoje";
    if (diff === 1) return "Ontem";
    return `${diff} dias atrás`;
  };

  return (
    <LinearGradient
      colors={["#001640", "#ffffff"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.25 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Notificações</Text>

      {/* Lista */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.category}</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardDate}>{formatDate(item.timestamp)}</Text>
          </View>
        ))}

        {notifications.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 50, color: "#555" }}>
            Nenhuma notificação disponível
          </Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 60,
    gap: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: "#E8EBF0",
    borderRadius: 20,
  },
  logo: { width: 110, height: 40, marginLeft: 10 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginTop: 15,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#F5F6F8",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
  tag: {
    backgroundColor: "#FDE4E7",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    color: "#F10A2D",
    fontSize: 12,
    fontWeight: "500",
  },
  cardDescription: {
    fontSize: 14,
    color: "#000",
    opacity: 0.8,
  },
  cardDate: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 5,
  },
});
