import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../AppNav";

const Footer: React.FC = (): React.ReactElement => {
  const navigation = useNavigation<RootStackNavigationProp>();

  return (
    <View
      style={{
        backgroundColor: "#ffffffff",
        opacity: 0.9,
        height: 70,
        width: "100%",
        position: "absolute",
        bottom: 0,
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row",
        paddingLeft: 25,
        paddingRight: 25,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("CaptureImage")}>
        <FontAwesome
          name="camera-retro"
          size={25}
          color={"black"}
          style={{ marginLeft: "auto", paddingRight: 5 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("AuditLog")}>
        <FontAwesome
          name="file-text-o"
          size={25}
          color={"black"}
          style={{ marginLeft: "auto", paddingRight: 5 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
        <FontAwesome
          name="cog"
          size={25}
          color={"black"}
          style={{ marginLeft: "auto", paddingRight: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({});