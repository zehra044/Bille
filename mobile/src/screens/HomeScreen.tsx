import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../../App";
import { getDashboardSummary } from "../api";
import { DashboardSummary } from "../types";
import { colors, formatMoney, styles } from "../ui";

type Props = BottomTabScreenProps<MainTabParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);

  useEffect(() => { getDashboardSummary().then(setDashboard).catch(() => setDashboard(null)); }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={styles.eyebrow}>Bille collections</Text>
        <Pressable accessibilityLabel="Open menu" onPress={() => navigation.navigate("More")} style={{ padding: 7 }}>
          <MaterialIcons name="menu" size={28} color={colors.ink} />
        </Pressable>
      </View>
      <Text style={[styles.title, { marginTop: 5 }]}>Keep every payment{`\n`}accounted for.</Text>
      <Text style={[styles.subtitle, { marginTop: 10 }]}>Your customer balances and collections in one place.</Text>

      <View style={{ backgroundColor: colors.primary, borderRadius: 22, padding: 20, marginTop: 24 }}>
        <Text style={{ color: "#BFDBFE", fontSize: 13, fontWeight: "700" }}>TOTAL OUTSTANDING</Text>
        <Text style={{ color: "white", fontSize: 30, fontWeight: "800", marginTop: 7 }}>
          {dashboard ? formatMoney(dashboard.totalOutstandingBalance) : "—"}
        </Text>
        <Text style={{ color: "#DBEAFE", marginTop: 6 }}>{dashboard ? `${dashboard.activeCustomers} customers with a balance` : "Connect the backend to see live figures"}</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 14 }}>
        <Metric label="Customers" value={dashboard?.totalCustomers} />
        <Metric label="Collected" value={dashboard ? formatMoney(dashboard.totalCollected) : undefined} />
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 28, marginBottom: 12 }]}>Start here</Text>
      <Action title="Customers" detail="Select a customer, then tap New charge or Payment" color="#EEF4FF" onPress={() => navigation.navigate("Customers")} />
      <Action title="Collection reports" detail="Review daily, monthly and outstanding amounts" color="#ECFDF3" onPress={() => navigation.navigate("Reports")} />
      <Action title="Business tools" detail="Dashboard, trash and data backup" color="#FFF7ED" onPress={() => navigation.navigate("More")} />
      {!dashboard && <ActivityIndicator color={colors.primary} style={{ marginTop: 16 }} />}
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string | number | undefined }) {
  return <View style={[styles.card, { flex: 1 }]}><Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text><Text style={{ color: colors.ink, fontWeight: "800", fontSize: 18, marginTop: 5 }}>{value ?? "—"}</Text></View>;
}

function Action({ title, detail, color, onPress }: { title: string; detail: string; color: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [{ backgroundColor: color, borderRadius: 16, padding: 16, marginBottom: 10, opacity: pressed ? 0.8 : 1 }]}><Text style={{ color: colors.ink, fontWeight: "800", fontSize: 16 }}>{title}</Text><Text style={{ color: colors.muted, fontSize: 13, marginTop: 3 }}>{detail}</Text></Pressable>;
}
