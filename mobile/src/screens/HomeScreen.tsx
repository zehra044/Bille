import React from "react";
import { View, Button, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Button title="Customers" onPress={() => navigation.navigate("Customers")} />
      <View style={{ height: 12 }} />
      <Button title="Dashboard" onPress={() => navigation.navigate("Dashboard")} />
      <View style={{ height: 12 }} />
      <Button title="Reports" onPress={() => navigation.navigate("Reports")} />
      <View style={{ height: 12 }} />
      <Button title="Trash" onPress={() => navigation.navigate("Trash")} />
      <View style={{ height: 12 }} />
      <Button title="Backup" onPress={() => navigation.navigate("Backup")} />
    </ScrollView>
  );
}
