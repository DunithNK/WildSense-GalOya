import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Footer from "../component/footer/Index";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../AppNav";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SettingCard {
  title: string;
  items: {
    label: string;
    description?: string;
  }[];
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const settingCards: SettingCard[] = [
  {
    title: "Model Management",
    items: [
      { label: "AI Model Version", description: "last updated: 2024-07-26 14:30 GMT" },
      { label: "Offline Model Availability", description: "Ensure full functionality without network access." },
      { label: "Schedule Training Jobs", description: "Improve model performance with scheduled updates." },
    ],
  },
  {
    title: "Data Synchronization",
    items: [
      { label: "Sync Status", description: "Pending uploads: 12" },
      { label: "Automatic Sync", description: "Sync data only on Wi-Fi." },
    ],
  },
  {
    title: "Contribution & Feedback",
    items: [
      { label: "Upload labeled examples", description: "Help improve the AI model by contributing verified data." },
      { label: "Submit Training Feedback", description: "Provide feedback on model prediction and identify errors." },
    ],
  },
  {
    title: "Privacy & Legal",
    items: [
      { label: "Share data with researchers", description: "Contribute anonymized data to wildlife conservation studies." },
      { label: "Privacy Policy" },
      { label: "Terms of Service" },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

const Setting: React.FC = (): React.ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome name="cog" size={20} color="#2c3e50" />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <FontAwesome name="share-alt" size={16} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {settingCards.map((card) => (
          <View key={card.title} style={styles.settingCard}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <View style={styles.cardDivider} />
            {card.items.map((item, index) => (
              <View
                key={item.label}
                style={[
                  styles.settingItem,
                  index < card.items.length - 1 && styles.settingItemBorder,
                ]}
              >
                <Text style={styles.settingLabel}>{item.label}</Text>
                {item.description && (
                  <Text style={styles.settingDescription}>
                    {item.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <Footer />
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 44,
    height: 90,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  settingCard: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2c3e50",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#e8e8e8",
    marginBottom: 10,
  },
  settingItem: {
    paddingVertical: 10,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 12,
    color: "#888",
    lineHeight: 17,
  },
});

export default Setting;