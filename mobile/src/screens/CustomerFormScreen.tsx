import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createCustomer, getCustomerById, updateCustomer } from "../api";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerForm">;

export default function CustomerFormScreen({ route, navigation }: Props) {
  const customerId = route.params?.customerId;
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(Boolean(customerId));

  useEffect(() => {
    if (customerId) {
      loadCustomer();
    }
  }, [customerId]);

  async function loadCustomer() {
    setInitialLoading(true);
    try {
      const customer = await getCustomerById(customerId!);
      setFullName(customer.fullName);
      setPhoneNumber(customer.phoneNumber);
      setAddress(customer.address ?? "");
      setNotes(customer.notes ?? "");
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to fetch customer");
    } finally {
      setInitialLoading(false);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const payload = { fullName, phoneNumber, address: address || undefined, notes: notes || undefined };
      if (customerId) {
        await updateCustomer(customerId, payload);
      } else {
        await createCustomer(payload);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to save customer");
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Full name</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 4, marginBottom: 16 }}
        value={fullName}
        onChangeText={setFullName}
      />
      <Text>Phone number</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 4, marginBottom: 16 }}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Text>Address</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 4, marginBottom: 16 }}
        value={address}
        onChangeText={setAddress}
      />
      <Text>Notes</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 4, marginBottom: 16 }}
        value={notes}
        onChangeText={setNotes}
      />
      <Button title={loading ? "Saving..." : "Save"} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}
