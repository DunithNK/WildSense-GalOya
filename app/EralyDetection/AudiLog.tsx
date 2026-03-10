import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
import Footer from "../component/footer/Index";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { RootStackNavigationProp } from "../../AppNav";
import BASE_URL from "./NetworkConst";
// ─── Types ───────────────────────────────────────────────────────────────────

interface Prediction {
  _id: string;
  animal_name: string;
  time: string;
  location: string;
  prediction_probability: number;
  status: string;
  image_name: string;
}

interface AgeData {
  image_id: string;
  status: string;
  predicted_age_minutes: number;
}

interface CombinedLog extends Omit<Prediction, "status">, Partial<AgeData> {
  id?: string;
  status_prediction: string;
  status_age?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

const AuditLog: React.FC = (): React.ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [combinedLogs, setCombinedLogs] = useState<CombinedLog[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const res1 = await axios.get<{ data: Prediction[] }>(
          BASE_URL + "history"
        );
        const res2 = await axios.get<{ data: AgeData[] }>(
          BASE_URL + "history2"
        );

        const predictions: Prediction[] = res1.data.data;
        const ageData: AgeData[] = res2.data.data;

        const merged: CombinedLog[] = predictions.map((pred) => {
          const match = ageData.find((age) => age.image_id === pred._id);

          return {
            ...pred,
            status_prediction: pred.status,
            status_age: match?.status,
            ...match,
          };
        });

        console.log("Merged Data:", merged);
        setCombinedLogs(merged);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // ─── Summary Counts ──────────────────────────────────────────────────────

  const totalCount: number = combinedLogs.length;
  const detectedCount: number = combinedLogs.filter(
    (item) => item.status_prediction === "Detected"
  ).length;
  const successCount: number = combinedLogs.filter(
    (item) => item.status_prediction === "success"
  ).length;

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome name="clipboard" size={20} color="#2c3e50" />
          <Text style={styles.headerTitle}>Audit Log</Text>
        </View>
        <FontAwesome name="share-alt" size={20} color="#2c3e50" />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Summary Title */}
        <Text style={styles.summaryTitle}>SUMMARY OVERVIEW</Text>
        <View style={styles.divider} />

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderTopColor: "#27ae60" }]}>
            <Text style={[styles.summaryValue, { color: "#27ae60" }]}>
              {totalCount}
            </Text>
            <Text style={styles.summaryLabel}>Total Signs</Text>
          </View>

          <View style={[styles.summaryCard, { borderTopColor: "#2980b9" }]}>
            <Text style={[styles.summaryValue, { color: "#2980b9" }]}>
              {detectedCount}
            </Text>
            <Text style={styles.summaryLabel}>Detected</Text>
          </View>

          <View style={[styles.summaryCard, { borderTopColor: "#c0392b" }]}>
            <Text style={[styles.summaryValue, { color: "#c0392b" }]}>
              {successCount}
            </Text>
            <Text style={styles.summaryLabel}>Success</Text>
          </View>
        </View>

        {/* Timeline Section */}
        <Text style={styles.sectionTitle}>DETECTION HISTORY</Text>

        {/* Timeline Items */}
        {combinedLogs.map((item, index) => (
          <View key={item._id ?? index} style={styles.timelineItem}>
            <Image
              source={{
                uri: BASE_URL + `/images/${item.image_name}`,
              }}
              style={styles.avatar}
            />
            <View style={styles.timelineContent}>
              <Text style={styles.rangerName}>
                {item.animal_name}
              </Text>
              <Text style={styles.timelineMeta}>
                {item.time}  ·  {item.location}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Score</Text>
                <Text style={styles.metaValue}>{item.prediction_probability}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Status</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: item.status_prediction === "Detected" ? "#eafaf1" : "#fef9e7" },
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: item.status_prediction === "Detected" ? "#27ae60" : "#f39c12" },
                  ]}>
                    {item.status_prediction}
                  </Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Age (min)</Text>
                <Text style={styles.metaValue}>{item.predicted_age_minutes}</Text>
              </View>
            </View>
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
    paddingTop: 8,
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
  divider: {
    width: 40,
    height: 3,
    backgroundColor: "#2c3e50",
    borderRadius: 2,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 8,
    paddingTop: 24,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eaeaea",
    borderTopWidth: 3,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: "800",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  timelineItem: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 6,
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  timelineContent: {
    flex: 1,
  },
  rangerName: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1a1a1a",
    marginBottom: 2,
  },
  timelineMeta: {
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  metaLabel: {
    fontSize: 12,
    color: "#999",
    width: 70,
    fontWeight: "500",
  },
  metaValue: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default AuditLog;