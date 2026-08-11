import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getCustomers } from "../api";
import { Customer } from "../types";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Customers">;

export default function CustomersListScreen({ navigation }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="New Customer" onPress={() => navigation.navigate("CustomerForm")} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : error ? (
        <Text style={{ marginTop: 24, color: "red" }}>{error}</Text>
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ padding: 16, borderBottomWidth: 1, borderColor: "#ddd" }}
              onPress={() => navigation.navigate("CustomerDetail", { customerId: item.id })}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.fullName}</Text>
              <Text>{item.phoneNumber}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
