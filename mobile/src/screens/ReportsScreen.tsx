import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, FlatList, ScrollView, Alert } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { getDailyCollections, getMonthlyCollections, getOutstandingBalances } from "../api";
import { CollectionReport, OutstandingBalanceEntry } from "../types";
import { MainTabParamList } from "../../App";

type Props = BottomTabScreenProps<MainTabParamList, "Reports">;

export default function ReportsScreen({ navigation }: Props) {
  const [outstanding, setOutstanding] = useState<OutstandingBalanceEntry[]>([]);
  const [dailyDate, setDailyDate] = useState(() => {
    const now = new Date();
    const shifted = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return shifted.toISOString().slice(0, 10);
  });
  const [dailyReport, setDailyReport] = useState<CollectionReport | null>(null);
  const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear().toString());
  const [monthlyMonth, setMonthlyMonth] = useState((new Date().getMonth() + 1).toString());
  const [monthlyReport, setMonthlyReport] = useState<CollectionReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOutstanding();
  }, []);

  async function loadOutstanding() {
    setLoading(true);
    setError(null);
    try {
      setOutstanding(await getOutstandingBalances());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load outstanding balances");
    } finally {
      setLoading(false);
    }
  }

  async function loadDaily() {
    setLoading(true);
    setError(null);
    try {
      setDailyReport(await getDailyCollections(dailyDate));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load daily report");
    } finally {
      setLoading(false);
    }
  }

  async function loadMonthly() {
    setLoading(true);
    setError(null);
    try {
      setMonthlyReport(await getMonthlyCollections(Number(monthlyYear), Number(monthlyMonth)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load monthly report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Reports</Text>
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: "600" }}>Outstanding balances</Text>
        {loading && !outstanding.length ? <ActivityIndicator /> : null}
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
        <FlatList
          data={outstanding}
          keyExtractor={(item) => item.customer.id}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" }}>
              <Text style={{ fontWeight: "bold" }}>{item.customer.fullName}</Text>
              <Text>Balance: {formatAmount(item.summary.balance)}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ marginTop: 8 }}>No outstanding balances</Text>}
        />
      </View>
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontWeight: "600" }}>Daily collections</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 8 }}
          value={dailyDate}
          onChangeText={setDailyDate}
          placeholder="YYYY-MM-DD"
        />
        <Button title="Load daily report" onPress={loadDaily} />
        {dailyReport ? (
          <View style={{ marginTop: 12 }}>
            <Text>Total collected: {formatAmount(dailyReport.totalCollected)}</Text>
            <FlatList
              data={dailyReport.transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" }}>
                  <Text>{item.customer.fullName}</Text>
                  <Text>{item.type} {formatAmount(item.amount)}</Text>
                </View>
              )}
            />
          </View>
        ) : null}
      </View>
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontWeight: "600" }}>Monthly collections</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 8, marginBottom: 8 }}
          value={monthlyYear}
          onChangeText={setMonthlyYear}
          placeholder="Year"
          keyboardType="number-pad"
        />
        <TextInput
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 8 }}
          value={monthlyMonth}
          onChangeText={setMonthlyMonth}
          placeholder="Month"
          keyboardType="number-pad"
        />
        <Button title="Load monthly report" onPress={loadMonthly} />
        {monthlyReport ? (
          <View style={{ marginTop: 12 }}>
            <Text>Total collected: {formatAmount(monthlyReport.totalCollected)}</Text>
            <FlatList
              data={monthlyReport.transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" }}>
                  <Text>{item.customer.fullName}</Text>
                  <Text>{item.type} {formatAmount(item.amount)}</Text>
                </View>
              )}
            />
          </View>
        ) : null}
      </View>
      <View style={{ marginTop: 24 }}>
        <Button title="Refresh outstanding balances" onPress={loadOutstanding} />
      </View>
    </ScrollView>
  );
}

function formatAmount(amount: string | number) {
  return typeof amount === "string" ? amount : amount.toFixed(2);
}
