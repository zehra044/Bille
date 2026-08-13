import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NavigationProp } from "@react-navigation/native";
import { getCustomers } from "../api";
import { Customer } from "../types";
import { MainTabParamList, RootStackParamList } from "../../App";
import { colors, styles } from "../ui";

type Props = BottomTabScreenProps<MainTabParamList, "Customers">;

export default function CustomersListScreen({ navigation }: Props) {
  const rootNavigation = navigation.getParent() as NavigationProp<RootStackParamList> | undefined;
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
    <View style={styles.screen}>
      <View style={{ padding: 20, paddingBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View><Text style={styles.eyebrow}>Accounts</Text><Text style={[styles.title, { marginTop: 3 }]}>Customers</Text></View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable accessibilityLabel="Open menu" onPress={() => navigation.navigate("More")} style={{ padding: 7 }}><MaterialIcons name="menu" size={27} color={colors.ink} /></Pressable>
          <Pressable onPress={() => rootNavigation?.navigate("CustomerForm", {})} style={{ backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 }}><Text style={{ color: "white", fontWeight: "800" }}>+ Add</Text></Pressable>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : error ? (
        <Text style={{ margin: 24, color: colors.danger }}>{error}</Text>
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 10 }}
          ListEmptyComponent={<Text style={styles.empty}>No customers yet. Add your first customer to start tracking balances.</Text>}
          renderItem={({ item }) => (
            <View style={[styles.card, { padding: 16 }]}>
              <TouchableOpacity onPress={() => rootNavigation?.navigate("CustomerDetail", { customerId: item.id })}>
              <Text style={{ fontSize: 16, fontWeight: "800", color: colors.ink }}>{item.fullName}</Text>
              <Text style={{ color: colors.muted, marginTop: 4 }}>{item.phoneNumber}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
                <Pressable onPress={() => rootNavigation?.navigate("TransactionForm", { customerId: item.id, initialType: "CHARGE" })} style={{ flex: 1, backgroundColor: "#FFF7ED", borderColor: "#FED7AA", borderWidth: 1, borderRadius: 10, paddingVertical: 9 }}>
                  <Text style={{ textAlign: "center", color: colors.warning, fontWeight: "800", fontSize: 13 }}>Add charge</Text>
                </Pressable>
                <Pressable onPress={() => rootNavigation?.navigate("TransactionForm", { customerId: item.id, initialType: "PAYMENT" })} style={{ flex: 1, backgroundColor: "#DCFCE7", borderColor: "#BBF7D0", borderWidth: 1, borderRadius: 10, paddingVertical: 9 }}>
                  <Text style={{ textAlign: "center", color: colors.success, fontWeight: "800", fontSize: 13 }}>Record payment</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
