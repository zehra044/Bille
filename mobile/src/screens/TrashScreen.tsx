import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, FlatList, ScrollView, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { deleteTrashCustomer, deleteTrashTransaction, getTrash } from "../api";
import { TrashContent } from "../types";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Trash">;

export default function TrashScreen({ navigation }: Props) {
  const [trash, setTrash] = useState<TrashContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrash();
  }, []);

  async function fetchTrash() {
    setLoading(true);
    setError(null);
    try {
      setTrash(await getTrash());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trash");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCustomer(id: string) {
    Alert.alert("Confirm", "Permanently delete this customer?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          await deleteTrashCustomer(id);
          fetchTrash();
        } catch (err) {
          Alert.alert("Error", err instanceof Error ? err.message : "Failed to delete customer");
        }
      } },
    ]);
  }

  async function handleDeleteTransaction(id: string) {
    Alert.alert("Confirm", "Permanently delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          await deleteTrashTransaction(id);
          fetchTrash();
        } catch (err) {
          Alert.alert("Error", err instanceof Error ? err.message : "Failed to delete transaction");
        }
      } },
    ]);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Trash</Text>
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: "600" }}>Archived customers</Text>
        <FlatList
          data={trash?.customers ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" }}>
              <Text>{item.fullName}</Text>
              <Text>{item.phoneNumber}</Text>
              <Button title="Delete permanently" color="red" onPress={() => handleDeleteCustomer(item.id)} />
            </View>
          )}
          ListEmptyComponent={<Text style={{ marginTop: 8 }}>No archived customers</Text>}
        />
      </View>
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontWeight: "600" }}>Deleted transactions</Text>
        <FlatList
          data={trash?.transactions ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" }}>
              <Text>{item.type} {formatAmount(item.amount)}</Text>
              <Text>{item.customer.fullName}</Text>
              <Text>{new Date(item.deletedAt ?? "").toLocaleString()}</Text>
              <Button title="Delete permanently" color="red" onPress={() => handleDeleteTransaction(item.id)} />
            </View>
          )}
          ListEmptyComponent={<Text style={{ marginTop: 8 }}>No deleted transactions</Text>}
        />
      </View>
    </ScrollView>
  );
}

function formatAmount(amount: string | number) {
  return typeof amount === "string" ? amount : amount.toFixed(2);
}
