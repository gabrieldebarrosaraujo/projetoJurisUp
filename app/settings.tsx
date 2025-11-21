import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const auth = getAuth();

  // Lista de avatares genéricos (URLs)
  const avatarOptions = [
    "https://i.imgur.com/0y8Ftya.png", // masculino
    "https://i.imgur.com/QrKJwQ0.png", // feminino
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [userName, setUserName] = useState("Usuário");
  const [userEmail, setUserEmail] = useState("usuario@email.com");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || "Usuário");
      setUserEmail(user.email || "usuario@email.com");
    }
  }, []);

  return (
    <LinearGradient
      colors={["#001640", "#ffffff"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.25 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.push("/home")} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#001640" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image source={require("../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>Configurações</Text>

        {/* Perfil */}
        <View style={styles.profileSection}>
          <Image source={{ uri: selectedAvatar }} style={styles.avatar} />
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.email}>{userEmail}</Text>
          <Text style={styles.selectAvatarLabel}>Escolha seu avatar:</Text>

          <View style={styles.avatarGrid}>
            {avatarOptions.map((url, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedAvatar(url)}
                style={[styles.avatarOption, selectedAvatar === url && styles.avatarSelected]}
              >
                <Image source={{ uri: url }} style={styles.avatarOptionImage} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar perfil SVG</Text>
          </TouchableOpacity>
        </View>

        {/* Seções */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Geral</Text>
          <TouchableOpacity style={styles.item} onPress={() => router.push("/editNotifications")}>
            <Text style={styles.itemText}>Editar notificações</Text>
            <FontAwesome name="chevron-right" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          <TouchableOpacity style={styles.item} onPress={() => router.push("/interestAreas")}>
            <Text style={styles.itemText}>Áreas de interesse</Text>
            <FontAwesome name="chevron-right" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança e privacidade</Text>
          <TouchableOpacity style={styles.item} onPress={() => router.push("/changePassword")}>
            <Text style={styles.itemText}>Mudar senha</Text>
            <FontAwesome name="chevron-right" size={16} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.item, styles.deactivateItem]} onPress={() => router.push("/deactivateAccount")}>
            <Text style={[styles.itemText, { color: "#F10A2D" }]}>Desativar conta</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40, alignItems: "center" },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    width: "100%",
    paddingHorizontal: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 8,
    backgroundColor: "#E8EBF0",
    borderRadius: 20,
    zIndex: 10,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: { width: 130, height: 50 },

  title: { fontSize: 22, fontWeight: "bold", color: "#001640", marginTop: 10 },

  profileSection: { alignItems: "center", marginTop: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "bold", color: "#000" },
  email: { fontSize: 14, color: "#555" },
  selectAvatarLabel: { marginTop: 15, fontSize: 14, color: "#333", fontWeight: "600" },
  avatarGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 10, gap: 12 },
  avatarOption: { width: 55, height: 55, borderRadius: 28, borderWidth: 2, borderColor: "transparent", overflow: "hidden" },
  avatarOptionImage: { width: "100%", height: "100%", borderRadius: 28 },
  avatarSelected: { borderColor: "#F10A2D" },

  editButton: { backgroundColor: "#F10A2D", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 20, marginTop: 15 },
  editButtonText: { color: "#fff", fontWeight: "bold" },

  section: { width: "90%", backgroundColor: "#F6F7FA", borderRadius: 12, padding: 15, marginTop: 25 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#000", marginBottom: 10 },
  item: { backgroundColor: "#fff", paddingVertical: 14, paddingHorizontal: 15, borderRadius: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  itemText: { fontSize: 15, color: "#000" },
  deactivateItem: { backgroundColor: "#FFE5E5" },

  logoutButton: { marginTop: 25 },
  logoutText: { color: "#F10A2D", fontWeight: "bold", fontSize: 16, textAlign: "center" },
});
