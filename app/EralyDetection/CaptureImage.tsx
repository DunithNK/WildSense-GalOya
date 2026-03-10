import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import Footer from "../component/footer/Index";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { RootStackNavigationProp } from "../../AppNav";
import BASE_URL from "./NetworkConst";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PredictionResponse {
  id: string;
  yolo_prediction: {
    object_type: string;
    probability: number;
  };
  animal_name?: string;
  status?: string;
  prediction_probability?: number;
  image_name?: string;
}

interface FootAgePayload {
  image_id: string;
  edge_density: number;
  brightness: number;
  humidity: number;
  temperature: number;
  rainfall: number;
  note: string;
}

interface FootAgeResponse {
  predicted_age_minutes: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

const CaptureImage: React.FC = (): React.ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();

  const [edge_density, setEdgeDensity] = useState<string>("");
  const [brightness, setBrightness] = useState<string>("");
  const [humidity, setHumidity] = useState<string>("");
  const [temperature, setTemperature] = useState<string>("");
  const [rainfall, setRainfall] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

  // ─── Pick & Upload Image ────────────────────────────────────────────────

  const pickImage = async (): Promise<void> => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required to access images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;

    const asset = result.assets[0];
    setImage(asset.uri);

    const formData = new FormData();

    // On web, fetch the URI as a blob; on native, use the RN-style object
    if (typeof window !== "undefined" && typeof fetch !== "undefined" && asset.uri.startsWith("blob:")) {
      const blob = await fetch(asset.uri).then((r) => r.blob());
      formData.append("image", blob, asset.fileName ?? "image.jpg");
    } else {
      formData.append("image", {
        uri: asset.uri,
        name: asset.fileName ?? "image.jpg",
        type: "image/jpeg",
      } as unknown as Blob);
    }

    try {
      const response = await axios.post<PredictionResponse>(
        BASE_URL + "predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Prediction Result:", response.data);

      const payload: FootAgePayload = {
        image_id: response.data.id,
        edge_density: parseFloat(edge_density),
        brightness: parseFloat(brightness),
        humidity: parseFloat(humidity),
        temperature: parseFloat(temperature),
        rainfall: parseFloat(rainfall),
        note,
      };

      axios
        .post<FootAgeResponse>(
          BASE_URL + "predict-foot-age",
          payload
        )
        .then((res) => {
          console.log(res.data);
          const detection_intent = {
            result: response.data,
            imageUri: asset.uri,
            time: res.data,
          }

          navigation.navigate("DetectionResult", detection_intent);
        })
        .catch((err: Error) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome name="paw" size={22} color="#2c3e50" />
          <Text style={styles.headerTitle}>Wildlife Tracker</Text>
        </View>
        <View style={styles.headerRight}>
          <FontAwesome name="binoculars" size={20} color="#2c3e50" />
          <FontAwesome name="wifi" size={20} color="#2c3e50" style={{ marginLeft: 16 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.heading}>AI Wildlife Sign & Spoor Tracker</Text>
        <View style={styles.divider} />

        <Text style={styles.description}>
          Identifies animal signs, tracks individuals, logs sightings offline,
          and assists rangers in efficient wildlife conservation.
        </Text>

        {/* Environmental Parameters */}
        <Text style={styles.sectionTitle}>Environmental Parameters</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Edge Density</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter value"
            placeholderTextColor="#999"
            value={edge_density}
            onChangeText={setEdgeDensity}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Brightness</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter value"
            placeholderTextColor="#999"
            value={brightness}
            onChangeText={setBrightness}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Humidity (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter value"
            placeholderTextColor="#999"
            value={humidity}
            onChangeText={setHumidity}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Temperature (°C)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter value"
            placeholderTextColor="#999"
            value={temperature}
            onChangeText={setTemperature}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rainfall (mm)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter value"
            placeholderTextColor="#999"
            value={rainfall}
            onChangeText={setRainfall}
            keyboardType="numeric"
          />
        </View>

        {/* Notes */}
        <Text style={styles.sectionTitle}>Additional Notes</Text>

        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="Enter any observations or remarks..."
          placeholderTextColor="#999"
          value={note}
          onChangeText={setNote}
          multiline
        />

        {/* Upload */}
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          <FontAwesome name="camera" size={18} color="#ffffff" />
          <Text style={styles.uploadText}>Upload Image</Text>
        </TouchableOpacity>

        {image && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Image Preview</Text>
            <Image source={{ uri: image }} style={styles.previewImage} />
          </View>
        )}
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
    paddingTop: 24,
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  divider: {
    width: 50,
    height: 3,
    backgroundColor: "#2c3e50",
    alignSelf: "center",
    borderRadius: 2,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#555555",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fafafa",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    color: "#1a1a1a",
  },
  noteInput: {
    height: 100,
    textAlignVertical: "top",
    marginTop: 4,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2c3e50",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginTop: 28,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  uploadText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 10,
    letterSpacing: 0.4,
  },
  previewContainer: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 8,
    overflow: "hidden",
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#777",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  previewImage: {
    width: "100%",
    height: 220,
  },
  description: {
    textAlign: "center",
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
    lineHeight: 21,
    paddingHorizontal: 12,
  },
});

export default CaptureImage;