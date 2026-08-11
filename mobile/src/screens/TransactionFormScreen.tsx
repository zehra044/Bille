import React, { useState } from "react";
import { View, Text, TextInput, Button, Platform, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createTransaction } from "../api";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "TransactionForm">;

export default function TransactionFormScreen({ route, navigation }: Props) {
  const { customerId } = route.params;
  const [type, setType] = useState<"CHARGE" | "PAYMENT" | "ADJUSTMENT">("CHARGE");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!amount) {
      Alert.alert("Validation", "Amount is required");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        type,
        amount: Number(amount),
        date,
        description: description || undefined,
        paymentMethod: paymentMethod || undefined,
        reason: reason || undefined,
      };
      await createTransaction(customerId, payload);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Type</Text>
      {(["CHARGE", "PAYMENT", "ADJUSTMENT"] as const).map((value) => (
        <Button
          key={value}
          title={`${type === value ? "●" : "○"} ${value}`}
          onPress={() => setType(value)}
        />
      ))}
      <Text style={{ marginTop: 16 }}>Amount</Text>
      <TextInput
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 4, marginBottom: 16 }}
        value={amount}
        onChangeText={setAmount}
      />
      <Text>Date</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 4, marginBottom: 16 }}
        value={date}
        onChangeText={setDate}
      />
      {type === "CHARGE" ? (
        <>
          <Text>Description</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 4, marginBottom: 16 }}
            value={description}
            onChangeText={setDescription}
          />
        </>
      ) : null}
      {type === "PAYMENT" ? (
        <>
          <Text>Payment method</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 4, marginBottom: 16 }}
            value={paymentMethod}
            onChangeText={setPaymentMethod}
          />
        </>
      ) : null}
      {type === "ADJUSTMENT" ? (
        <>
          <Text>Reason</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 4, marginBottom: 16 }}
            value={reason}
            onChangeText={setReason}
          />
        </>
      ) : null}
      <Button title={loading ? "Saving..." : "Save transaction"} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}
