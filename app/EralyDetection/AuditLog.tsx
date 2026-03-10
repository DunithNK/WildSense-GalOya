import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackNavigationProp, RootStackParamList } from "../../AppNav";

type AuditLogRouteProp = RouteProp<RootStackParamList, "AuditLog">;

const AuditLog: React.FC = (): React.ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<AuditLogRouteProp>();

  // Retrieve detection result data passed from DetectionResult
  const detectionData = route.params;

  const handleBackToDetectionResult = (): void => {
    if (detectionData?.result && detectionData?.imageUri && detectionData?.time) {
      navigation.navigate("DetectionResult", {
        result: detectionData.result,
        imageUri: detectionData.imageUri,
        time: detectionData.time,
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <View>
      <Text>Audit Log</Text>
      <Button title="Back" onPress={handleBackToDetectionResult} />
    </View>
  );
};

export default AuditLog;
