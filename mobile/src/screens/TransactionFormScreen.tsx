import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createTransaction } from "../api";
import { RootStackParamList } from "../../App";
import { colors, styles } from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "TransactionForm">;

export default function TransactionFormScreen({ route, navigation }: Props) {
  const { customerId, initialType } = route.params;
  const [type, setType] = useState<"CHARGE" | "PAYMENT" | "ADJUSTMENT">(initialType ?? "CHARGE");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const trimmedAmount = amount.trim();
    const parsedAmount = Number(trimmedAmount);

    if (!trimmedAmount || !Number.isFinite(parsedAmount)) {
      Alert.alert("Validation", "Amount is required");
      return;
    }

    if (parsedAmount <= 0) {
      Alert.alert("Validation", "Amount must be greater than zero");
      return;
    }

    if (type === "CHARGE" && !description.trim()) {
      Alert.alert("Validation", "A charge description is required");
      return;
    }

    if (type === "PAYMENT" && !paymentMethod.trim()) {
      Alert.alert("Validation", "A payment method is required");
      return;
    }

    if (type === "ADJUSTMENT" && !reason.trim()) {
      Alert.alert("Validation", "An adjustment reason is required");
      return;
    }

    if (type === "ADJUSTMENT" && parsedAmount === 0) {
      Alert.alert("Validation", "Adjustment amount cannot be zero");
      return;
    }

    setLoading(true);
    try {
      const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      const payload = {
        type,
        amount: parsedAmount,
        date: utcDate.toISOString().slice(0, 10),
        description: description.trim() || undefined,
        paymentMethod: paymentMethod.trim() || undefined,
        reason: reason.trim() || undefined,
      };
      await createTransaction(customerId, payload);
      const actionLabel = type === "PAYMENT" ? "Payment recorded" : type === "ADJUSTMENT" ? "Adjustment saved" : "Charge added";
      Alert.alert("Success", `${actionLabel} successfully.`, [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("CustomerDetail", {
              customerId,
              refreshKey: Date.now(),
            });
          },
        },
      ]);
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
      <Pressable
        onPress={() => setShowDatePicker(true)}
        style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, marginTop: 8 }}
      >
        <Text style={{ color: colors.ink, fontSize: 18 }}>{date.toISOString().slice(0, 10)}</Text>
      </Pressable>
      {showDatePicker ? (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      ) : null}
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
