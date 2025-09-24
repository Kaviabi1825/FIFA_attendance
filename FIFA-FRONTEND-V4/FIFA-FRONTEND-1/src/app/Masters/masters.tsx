import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import { Appbar, FAB } from "react-native-paper";
import { useRouter } from "expo-router";
import BottomNavigation from "../../components/BottomNavigation";

import generalIcon from "../../../assets/images/general_icon.png";
import materialIcon from "../../../assets/images/material_icon.png";
import machineIcon from "../../../assets/images/machine_icon.png";
import tailorIcon from "../../../assets/images/tailor_icon.png";

import General from "./General";
const Material = require("./Material.tsx").default;
const Machine = require("./Machine.tsx").default;
const Tailor = require("./Tailor.tsx").default;

type TabKey = "General" | "Material" | "Machine" | "Tailor";

export default function MastersScreen() {
  const [active, setActive] = useState<TabKey>("General");
  const router = useRouter();

  const handleFabPress = () => {
    if (active === "Material") {
      router.push({ pathname: "/Masters/MaterialCreate" } as any);
    }
    if (active === "Machine") {
      // Could open a modal or another screen for adding machines
      // Example: Navigate or set state
      router.push({ pathname: "/Masters/MachineCreate" } as any);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color="white" />
        <Appbar.Content title="Masters Data" color="white" />
      </Appbar.Header>

      <View style={styles.iconRowContainer}>
        <View style={styles.iconRow}>
          {[
            { key: "General", icon: generalIcon },
            { key: "Material", icon: materialIcon },
            { key: "Machine", icon: machineIcon },
            { key: "Tailor", icon: tailorIcon },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={styles.iconItem}
              onPress={() => setActive(tab.key as TabKey)}
            >
              <View
                style={[
                  styles.iconBg,
                  active === tab.key
                    ? styles.iconActiveBg
                    : styles.iconInactiveBg,
                ]}
              >
                <View style={styles.iconOuter}>
                  <Image source={tab.icon} style={styles.iconImage} />
                </View>
              </View>
              <Text style={styles.iconLabel}>{tab.key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {active === "General" && <General />}
        {active === "Material" && <Material />}
        {active === "Machine" && <Machine />}
        {active === "Tailor" && <Tailor />}
      </ScrollView>

      {/* Fixed FAB for Material & Machine */}
      {(active === "Material" || active === "Machine") && (
        <FAB icon="plus" style={styles.fab} onPress={handleFabPress} />
      )}

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: { backgroundColor: "#009688" },
  iconRowContainer: { padding: 20 },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconItem: { alignItems: "center" },
  iconImage: { width: 34, height: 34 },
  iconLabel: { fontSize: 14, marginTop: 8, color: "#333", fontWeight: "600" },
  content: { padding: 15 },
  iconOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  iconActiveBg: { backgroundColor: "#009688" },
  iconInactiveBg: { backgroundColor: "#E0E0E0" },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 84,
    backgroundColor: "#009687e9",
    borderRadius: 50,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    elevation: 6,
  },
});
