import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, ActivityIndicator, ScrollView, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getCustomerById, getCustomerTransactions } from "../api";
import { Customer, Transaction, CustomerSummary } from "../types";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerDetail">;

export default function CustomerDetailScreen({ route, navigation }: Props) {
  const { customerId } = route.params;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<CustomerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const [customerData, transactionsData] = await Promise.all([
        getCustomerById(customerId),
        getCustomerTransactions(customerId),
      ]);
      setCustomer(customerData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customer");
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

  if (error || !customer) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ color: "red" }}>{error || "Customer not found"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{customer.fullName}</Text>
      <Text style={{ marginTop: 8 }}>{customer.phoneNumber}</Text>
      <Text style={{ marginTop: 4 }}>{customer.address}</Text>
      <Text style={{ marginTop: 4 }}>{customer.notes}</Text>

      <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          title="Edit"
          onPress={() => navigation.navigate("CustomerForm", { customerId: customer.id })}
        />
        <Button title="New Transaction" onPress={() => navigation.navigate("TransactionForm", { customerId })} />
      </View>

      <Text style={{ marginTop: 24, fontSize: 18, fontWeight: "600" }}>Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "#eee" }}>
            <Text style={{ fontWeight: "bold" }}>{item.type}</Text>
            <Text>{item.amount}</Text>
            <Text>{new Date(item.date).toLocaleDateString()}</Text>
            {item.description ? <Text>{item.description}</Text> : null}
            {item.paymentMethod ? <Text>{item.paymentMethod}</Text> : null}
            {item.reason ? <Text>{item.reason}</Text> : null}
          </View>
        )}
      />
    </ScrollView>
  );
}
