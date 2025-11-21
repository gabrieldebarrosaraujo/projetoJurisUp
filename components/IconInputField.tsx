import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";

type IconInputFieldProps = {
  label: string;
  placeholder: string;
  iconName: keyof typeof FontAwesome.glyphMap;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
};

export default function IconInputField({
  label,
  placeholder,
  iconName,
  secureTextEntry = false,
  value,
  onChangeText,
}: IconInputFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <FontAwesome name={iconName} size={20} color="#3C3C4340" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#3C3C4340"
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: "100%", // garante que o campo ocupe a largura do container
  },
  label: {
    fontSize: 14,
    color: "#211611",
    marginBottom: 6,
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#78788014",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    height: 50, // 🔥 define altura fixa (pode ajustar conforme design)
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1, // 🔥 faz o input ocupar todo o espaço disponível
    fontSize: 16,
    color: "#333",
  },

});