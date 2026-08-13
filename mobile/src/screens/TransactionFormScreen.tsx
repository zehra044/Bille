import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createTransaction } from "../api";
import { RootStackParamList } from "../../App";
import { colors, styles } from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "TransactionForm">;

export default function TransactionFormScreen({ route, navigation }: Props) {
  const { customerId, initialType } = route.params;
  const [type, setType] = useState<"CHARGE" | "PAYMENT" | "ADJUSTMENT">(initialType ?? "CHARGE");
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

    if (type === "PAYMENT" && !paymentMethod) {
      Alert.alert("Validation", "Payment method is required for payments");
      return;
    }

    if (type === "CHARGE" && !description) {
      Alert.alert("Validation", "Description is recommended for charges");
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

  const isPayment = type === "PAYMENT";
  const title = isPayment ? "Record payment" : type === "CHARGE" ? "Add charge" : "Adjustment";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>{isPayment ? "Money received" : type === "CHARGE" ? "New amount owed" : "Correct a balance"}</Text>
      <Text style={[styles.title, { marginTop: 4 }]}>{title}</Text>
      <Text style={[styles.subtitle, { marginTop: 8 }]}>{isPayment ? "Record money this customer has paid you." : "Add an amount this customer now owes."}</Text>

      <Text style={[styles.sectionTitle, { marginTop: 26 }]}>Amount</Text>
      <TextInput
        keyboardType="numeric"
        placeholder="0.00"
        placeholderTextColor="#98A2B3"
        style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginTop: 8, fontSize: 22, fontWeight: "700", color: colors.ink }}
        value={amount}
        onChangeText={setAmount}
      />
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Date</Text>
      <TextInput
        style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginTop: 8, color: colors.ink }}
        value={date}
        onChangeText={setDate}
      />
      {type === "CHARGE" ? (
        <>
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>What was charged?</Text>
          <TextInput
            placeholder="e.g. Goods supplied"
            placeholderTextColor="#98A2B3"
            style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginTop: 8, color: colors.ink }}
            value={description}
            onChangeText={setDescription}
          />
        </>
      ) : null}
      {type === "PAYMENT" ? (
        <>
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Payment method</Text>
          <TextInput
            placeholder="e.g. Cash, bank transfer"
            placeholderTextColor="#98A2B3"
            style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginTop: 8, color: colors.ink }}
            value={paymentMethod}
            onChangeText={setPaymentMethod}
          />
        </>
      ) : null}
      {type === "ADJUSTMENT" ? (
        <>
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Reason</Text>
          <TextInput
            style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginTop: 8, color: colors.ink }}
            value={reason}
            onChangeText={setReason}
          />
        </>
      ) : null}
      <Pressable disabled={loading} onPress={handleSubmit} style={{ backgroundColor: isPayment ? colors.success : colors.primary, borderRadius: 13, padding: 16, marginTop: 28, opacity: loading ? 0.6 : 1 }}>
        <Text style={{ color: "white", fontWeight: "800", textAlign: "center", fontSize: 16 }}>{loading ? "Saving…" : isPayment ? "Record payment" : "Add charge"}</Text>
      </Pressable>
    </ScrollView>
  );
}
