import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, Button, ScrollView } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { getDashboardSummary } from "../api";
import { DashboardSummary } from "../types";
import { MainTabParamList } from "../../App";

type Props = BottomTabScreenProps<MainTabParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    setLoading(true);
    setError(null);
    try {
      setDashboard(await getDashboardSummary());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "red" }}>{error || "No dashboard data"}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Dashboard</Text>
      <Text style={{ marginTop: 12 }}>Total customers: {dashboard.totalCustomers}</Text>
      <Text>Total outstanding balance: {dashboard.totalOutstandingBalance}</Text>
      <Text>Total collected: {dashboard.totalCollected}</Text>
      <Text>Active customers with balance: {dashboard.activeCustomers}</Text>
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Recent transactions</Text>
        <FlatList
          data={dashboard.recentTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: "#ddd" }}>
              <Text style={{ fontWeight: "bold" }}>{item.customer.fullName}</Text>
              <Text>{item.type} • {formatAmount(item.amount)} • {new Date(item.date).toLocaleDateString()}</Text>
            </View>
          )}
        />
      </View>
      <View style={{ marginTop: 16 }}>
        <Button title="Refresh" onPress={fetchDashboard} />
      </View>
    </ScrollView>
  );
}

function formatAmount(amount: string | number) {
  return typeof amount === "string" ? amount : amount.toFixed(2);
}
