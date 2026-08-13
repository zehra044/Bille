import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../../App";
import { colors, styles } from "../ui";

type Props = BottomTabScreenProps<MainTabParamList, "More">;

export default function MoreScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Tools</Text>
      <Text style={[styles.title, { marginTop: 4 }]}>More</Text>
      <Text style={[styles.subtitle, { marginTop: 8, marginBottom: 24 }]}>Reports, data protection and account tools.</Text>
      <MenuItem title="Dashboard" detail="Collection totals and recent activity" onPress={() => navigation.navigate("Dashboard")} />
      <MenuItem title="Trash" detail="Review and permanently remove deleted records" onPress={() => navigation.navigate("Trash")} />
      <MenuItem title="Backup & restore" detail="Export or restore your Bille data" onPress={() => navigation.navigate("Backup")} />
    </ScrollView>
  );
}

function MenuItem({ title, detail, onPress }: { title: string; detail: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { marginBottom: 10, opacity: pressed ? 0.75 : 1 }]}><Text style={{ fontSize: 16, fontWeight: "800", color: colors.ink }}>{title}</Text><Text style={{ color: colors.muted, marginTop: 4, fontSize: 13 }}>{detail}</Text></Pressable>;
}
