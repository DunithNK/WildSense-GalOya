import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Footer from "../component/footer/Index";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import axios from "axios";
import { RootStackNavigationProp, RootStackParamList } from "../../AppNav";
import BASE_URL from "./NetworkConst";

// API Endpoints Constants
const HISTORY_ENDPOINT = `${BASE_URL}:5006/history`;
const UPDATE_STATUS_ENDPOINT = `${BASE_URL}:5006/update-status`;
const IMAGE_BASE_URL = `${BASE_URL}:5006/images/`;


// ─── Types ───────────────────────────────────────────────────────────────────

type IndividualMatchRouteProp = RouteProp<RootStackParamList, "IndividualMatch">;

interface LogItem {
  id: string;
  animal_name: string;
  time: string;
  location: string;
  prediction_probability: number;
  status: string;
  image_name: string;
}

interface ConfirmPayload {
  id: string;
  s: string;
}

// ─── Static Timeline Data ─────────────────────────────────────────────────────

interface TimelineItem {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  image: number; // require() returns a number in React Native
}

const timelineData: TimelineItem[] = [
  {
    id: "1",
    name: "Ranger Alex",
    date: "2024-07-20",
    location: "Northern Sector - Grid C4",
    description:
      "Footprint found near the watering hole. Appears to be the same individual.",
    image: require("../../assets/spoor5.jpg"),
  },
  {
    id: "2",
    name: "Ranger Alex",
    date: "2024-07-15",
    location: "Eastern Ridge - Grid E1",
    description:
      "Confirmed sighting of the individual, same distinct claw mark pattern.",
    image: require("../../assets/spoor5.jpg"),
  },
  {
    id: "3",
    name: "Ranger Sam",
    date: "2024-07-08",
    location: "River Delta - Grid B7",
    description:
      "First recorded sighting of this specific footprint, detailed analysis performed.",
    image: require("../../assets/spoor5.jpg"),
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

const IndividualMatch: React.FC = (): React.ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<IndividualMatchRouteProp>();

  const { result, imageUri, id } = route.params;

  const [isNewIndividual, setIsNewIndividual] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogItem[]>([]);

  console.log(id);

  // ─── Confirm Species ──────────────────────────────────────────────────────

  const confirm = (status: string): void => {
    const payload: ConfirmPayload = {
      id: id,
      s: status,
    };

    axios
      .put(UPDATE_STATUS_ENDPOINT, payload)
      .then(() => {
        console.log("Done");
      })
      .catch((err: Error) => {
        console.log(err);
      });
  };

  // ─── Fetch Logs ───────────────────────────────────────────────────────────

  useEffect(() => {
    axios
      .get<{ data: LogItem[] }>(HISTORY_ENDPOINT)
      .then((res) => {
        setLogs(res.data.data);
        console.log(res.data.data);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <FontAwesome name="arrow-left" size={18} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Individual Match</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerBtn, { marginRight: 8 }]}>
            <FontAwesome name="check" size={16} color="#27ae60" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <FontAwesome name="close" size={16} color="#c0392b" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Captured Image */}
        <View style={styles.imageContainer}>
          <Text style={styles.imageLabel}>Captured Image</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>

        {/* Animal Image Grid */}
        <Text style={styles.sectionTitle}>REFERENCE IMAGES</Text>
        {result === "leopard" ? (
          <View style={styles.imageGrid}>
            <Image
              source={require("../../assets/leopard/l1.jpeg")}
              style={styles.gridImage}
            />
            <Image
              source={require("../../assets/leopard/l2.jpeg")}
              style={styles.gridImage}
            />
            <Image
              source={require("../../assets/leopard/l3.jpeg")}
              style={styles.gridImage}
            />
            <Image
              source={require("../../assets/leopard/l4.jpeg")}
              style={styles.gridImage}
            />
          </View>
        ) : (
          <View style={styles.imageGrid}>
            <Image
              source={require("../../assets/elephant/e1.jpg")}
              style={styles.gridImage}
            />
            <Image
              source={require("../../assets/elephant/e2.jpg")}
              style={styles.gridImage}
            />
            <Image
              source={require("../../assets/elephant/e3.jpg")}
              style={styles.gridImage}
            />
            <Image
              source={require("../../assets/elephant/e4.jpg")}
              style={styles.gridImage}
            />
          </View>
        )}

        {/* Action Card */}
        <View style={styles.actionCard}>
          <View style={styles.checkboxRow}>
            <Checkbox
              value={isNewIndividual}
              onValueChange={setIsNewIndividual}
              color={isNewIndividual ? "#27ae60" : undefined}
            />
            <Text style={styles.checkboxText}>Mark as New Individual</Text>
          </View>

          <TouchableOpacity
            style={styles.btnSuccess}
            onPress={() => confirm("success")}
          >
            <FontAwesome name="check-circle" size={14} color="#fff" />
            <Text style={styles.btnText}>Confirm Species</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDanger}
            onPress={() => navigation.navigate("CaptureImage")}
          >
            <FontAwesome name="flag" size={14} color="#fff" />
            <Text style={styles.btnText}>Flag Uncertain</Text>
          </TouchableOpacity>
        </View>

        {/* Sighting Timeline */}
        <Text style={styles.sectionTitle}>SIGHTING TIMELINE</Text>

        {logs.map((item) => (
          <View key={item.id} style={styles.timelineItem}>
            <Image
              source={{
                uri: `${IMAGE_BASE_URL}${item.image_name}`,
              }}
              style={styles.avatar}
            />
            <View style={styles.timelineContent}>
              <Text style={styles.rangerName}>
                {item.animal_name}
              </Text>
              <Text style={styles.timelineMeta}>
                {item.time}  \u00b7  {item.location}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Score</Text>
                <Text style={styles.metaValue}>{item.prediction_probability}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Status</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: item.status === "success" ? "#eafaf1" : "#fef9e7" },
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    { color: item.status === "success" ? "#27ae60" : "#f39c12" },
                  ]}>{item.status}</Text>
                </View>
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
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2c3e50",
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  imageContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  imageLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#888",
    backgroundColor: "#fafafa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  gridImage: {
    width: "48%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  actionCard: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  btnSuccess: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#27ae60",
    paddingVertical: 13,
    borderRadius: 6,
    marginTop: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  btnDanger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c0392b",
    paddingVertical: 13,
    borderRadius: 6,
    marginTop: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    letterSpacing: 0.3,
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
    width: 48,
    height: 48,
    borderRadius: 8,
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
    width: 56,
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
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default IndividualMatch;