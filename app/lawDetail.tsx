import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { db } from "@/constants/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function LawDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // recebemos só o ID agora

  const [lei, setLei] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) carregarLei(id as string);
  }, [id]);

  const carregarLei = async (leiId: string) => {
    try {
      const ref = doc(db, "leis", leiId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        setLei({
          ...data,
          data: data.data?.toDate ? data.data.toDate() : data.data,
          dataUltimaAtualizacao: data.dataUltimaAtualizacao?.toDate
            ? data.dataUltimaAtualizacao.toDate()
            : data.dataUltimaAtualizacao,
        });
      }
    } catch (err) {
      console.error("Erro ao carregar lei:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !lei) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#001640" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#001640", "#ffffff"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 0.28 }}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={18} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resumo</Text>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentBox}>
          {/* Área + tags */}
          <View style={[styles.row, { alignItems: "center", marginBottom: 25 }]}>
            <Text style={styles.sectionTitle}>Área</Text>
            <View style={styles.tagsRow}>
              <View style={[styles.tag, { backgroundColor: "#F10A2D8C" }]}>
                <Text style={styles.tagText}>{lei.area}</Text>
              </View>

              {/* Exibe tag "Nova atualização" somente se existir dataUltimaAtualizacao */}
              {lei.dataUltimaAtualizacao && (
                <View style={[styles.tag, { backgroundColor: "#FFCC0080" }]}>
                  <Text style={[styles.tagText, { color: "white" }]}>Nova atualização</Text>
                </View>
              )}
            </View>
          </View>

          {/* Título e número */}
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldTitle}>Título da Lei</Text>
                <Text style={styles.fieldValueRed}>{lei.titulo}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.fieldTitle}>Nº Norma</Text>
                <Text style={styles.fieldValue}>{lei.numero}</Text>
              </View>
            </View>
          </View>

          {/* Data */}
          <View style={styles.section}>
            <Text style={styles.fieldTitle}>Data de Publicação</Text>
            <Text style={styles.fieldValueRed}>
              {lei.data instanceof Date
                ? lei.data.toLocaleDateString("pt-BR")
                : "Sem data"}
            </Text>
          </View>

          {/* Natureza Jurídica */}
          <View style={styles.section}>
            <Text style={styles.fieldTitle}>Natureza Jurídica</Text>
            <Text style={[styles.fieldValueRed, { color: "#E2001A" }]}>
              {lei.naturezaJuridica || "Não informado"}
            </Text>
          </View>

          {/* Resumo */}
          <View style={styles.section}>
            <Text style={styles.fieldTitle}>Resumo da Lei</Text>
            <Text style={styles.summaryText}>
              {lei.resumo || "Sem resumo disponível para esta legislação."}
            </Text>
          </View>

          {/* Resumo Atualização */}
          {lei.resumoAtualizacao && (
            <View style={styles.section}>
              <Text style={styles.fieldTitle}>Atualização</Text>
              <Text style={styles.summaryText}>{lei.resumoAtualizacao}</Text>
            </View>
          )}

          {/* Afetados */}
          {lei.afetados && (
            <View style={styles.section}>
              <Text style={styles.fieldTitle}>Afetados</Text>
              <Text style={styles.summaryText}>{lei.afetados}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    alignItems: "center",
    paddingTop: 50,
  },
  logo: {
    width: 160,
    height: 60,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    width: "90%",
  },
  backButton: {
    position: "absolute",
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00164033",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#001640",
    fontSize: 26,
    fontWeight: "bold",
  },

  scrollContent: {
    alignItems: "center",
    paddingBottom: 60,
  },
  contentBox: {
    backgroundColor: "#fff",
    borderRadius: 30,
    width: "100%",
    marginTop: 35,
    paddingVertical: 35,
    paddingHorizontal: 25,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#001640",
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tag: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 60,
    marginLeft: -60,
  },
  tagText: {
    fontSize: 12,
    color: "white",
  },

  fieldTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#001640",
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 15,
    color: "red",
  },
  fieldValueRed: {
    fontSize: 15,
    color: "#F10A2D",
  },
  summaryText: {
    fontSize: 15,
    color: "#222",
    textAlign: "justify",
    lineHeight: 22,
    marginTop: 6,
  },
});
