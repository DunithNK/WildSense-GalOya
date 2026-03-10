import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";
import Footer from "../component/footer/Index";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackNavigationProp, RootStackParamList } from "../../AppNav";

// ─── Types ───────────────────────────────────────────────────────────────────

type DetectionResultRouteProp = RouteProp<RootStackParamList, "DetectionResult">;

// ─── Context ─────────────────────────────────────────────────────────────────

interface DetectionResultState {
  result: string;
  imageUri: string;
  time: number;
}

let detectionResultStore: DetectionResultState = {
  result: "",
  imageUri: "",
  time: 0,
};

export const getDetectionResult = (): DetectionResultState => detectionResultStore;

export const setDetectionResult = (data: DetectionResultState): void => {
  detectionResultStore = { ...data };
};

// ─── Component ───────────────────────────────────────────────────────────────

const DetectionResult: React.FC = (): React.ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<DetectionResultRouteProp>();

  const { result, imageUri, time } = route.params;

  console.log("Detection Result:", time);

  const handleNavigationAuditLog = (): void => {
    navigation.navigate("AuditLog", {
      result,
      imageUri,
      time,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <FontAwesome name="arrow-left" size={18} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detection Result</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <FontAwesome name="share-alt" size={18} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Image Preview */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>

        <Text style={styles.finalNote}>
          Detected signs highlighted with confidence scores.
        </Text>

        {/* AI Result Card */}
        <View style={styles.resultCard}>
          <View style={styles.cardHeader}>
            <FontAwesome name="magic" size={14} color="#2c3e50" />
            <Text style={styles.cardTitle}>AI Detection Result</Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Prediction</Text>
            <Text style={styles.resultValue}>{result.yolo_prediction.object_type}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Probability</Text>
            <Text style={styles.resultValue}>{result.yolo_prediction.probability}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Estimated Age</Text>
            <Text style={styles.resultValue}>{(time.predicted_age_minutes / 60).toFixed(2)} Hours</Text>
          </View>
        </View>

        {/* Measurement Tools Card */}
        <View style={styles.resultCard}>
          <View style={styles.cardHeader}>
            <FontAwesome name="sort" size={14} color="#2c3e50" />
            <Text style={styles.cardTitle}>Measurement Tools</Text>
          </View>
        </View>

        {/* Primary Action */}
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate("DetectionResult", route.params)}
        >
          <FontAwesome name="compress" size={14} color="#fff" />
          <Text style={styles.btnPrimaryText}>Attach Scale Reference</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSuccess}
          onPress={handleNavigationAuditLog}
        >
          <FontAwesome name="check-circle" size={14} color="#fff" />
          <Text style={styles.btnPrimaryText}>Confirm Species</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => navigation.navigate("CaptureImage")}
        >
          <FontAwesome name="edit" size={14} color="#2c3e50" />
          <Text style={styles.btnOutlineText}>Edit Species</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnOutline}>
          <FontAwesome name="camera" size={14} color="#2c3e50" />
          <Text style={styles.btnOutlineText}>Capture Additional Angles</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.btnDanger}
        onPress={() => navigation.navigate("CaptureImage")}
        >
          <FontAwesome name="flag" size={14} color="#fff" />
          <Text style={styles.btnPrimaryText}>Flag Uncertain</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.btnPrimary}
        onPress={handleNavigationAuditLog}
        >
          <FontAwesome name="save" size={14} color="#fff" />
          <Text style={styles.btnPrimaryText}>Save to Audit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() =>
            navigation.navigate("IndividualMatch", {
              result: result.yolo_prediction.object_type,
              id: result.id,
              imageUri: imageUri,
            })
          }
        >
          <FontAwesome name="exchange" size={14} color="#2c3e50" />
          <Text style={styles.btnOutlineText}>Compare Details</Text>
        </TouchableOpacity>
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
  imageContainer: {
    marginTop: 20,
    marginBottom: 12,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eaeaea",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  finalNote: {
    textAlign: "center",
    fontSize: 13,
    color: "#888",
    marginBottom: 16,
    fontStyle: "italic",
  },
  resultCard: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2c3e50",
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#e8e8e8",
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  resultLabel: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },
  resultValue: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "600",
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2c3e50",
    paddingVertical: 13,
    borderRadius: 6,
    marginTop: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  btnSuccess: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#27ae60",
    paddingVertical: 13,
    borderRadius: 6,
    marginTop: 8,
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
    marginTop: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  btnOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 13,
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#d0d0d0",
  },
  btnPrimaryText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  btnOutlineText: {
    color: "#2c3e50",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    letterSpacing: 0.3,
  },
});

export default DetectionResult;