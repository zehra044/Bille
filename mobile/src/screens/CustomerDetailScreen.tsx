import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Share,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  getCustomerById,
  getCustomerSummary,
  getCustomerTransactions,
} from "../api";
import { Customer, Transaction, CustomerSummary } from "../types";
import { RootStackParamList } from "../../App";
import { colors, formatMoney, styles } from "../ui";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerDetail">;

export default function CustomerDetailScreen({ route, navigation }: Props) {
  const { customerId, refreshKey } = route.params;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<CustomerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchData);
    fetchData();
    return unsubscribe;
  }, [navigation, customerId, refreshKey]);

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const [customerData, transactionsData, summaryData] = await Promise.all([
        getCustomerById(customerId),
        getCustomerTransactions(customerId),
        getCustomerSummary(customerId),
      ]);
      setCustomer(customerData);
      setTransactions(transactionsData);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customer");
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    if (!customer || !summary) return;

    const message = [
      `Customer: ${customer.fullName}`,
      `Phone: ${customer.phoneNumber}`,
      `Balance: ${formatMoney(summary.summary.balance)}`,
      `Charges: ${formatMoney(summary.summary.totalCharges)}`,
      `Payments: ${formatMoney(summary.summary.totalPayments)}`,
    ].join("\n");

    await Share.share({
      title: `Balance for ${customer.fullName}`,
      message,
    });
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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Customer account</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{customer.fullName}</Text>
          <Text style={[styles.subtitle, { marginTop: 5 }]}>
            {customer.phoneNumber}
          </Text>
        </View>

        <Pressable
          onPress={handleShare}
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text style={{ color: colors.primary, fontWeight: "700" }}>Share</Text>
        </Pressable>
      </View>

      {customer.address ? (
        <Text style={[styles.subtitle, { marginTop: 3 }]}>
          {customer.address}
        </Text>
      ) : null}

      {summary ? (
        <View
          style={{
            marginTop: 20,
            backgroundColor: colors.primary,
            padding: 18,
            borderRadius: 18,
          }}
        >
          <Text style={{ color: "#BFDBFE", fontWeight: "700", fontSize: 12 }}>
            CURRENT BALANCE
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "800",
              marginTop: 5,
            }}
          >
            {formatMoney(summary.summary.balance)}
          </Text>
          <View style={{ flexDirection: "row", gap: 20, marginTop: 15 }}>
            <Text style={{ color: "#DBEAFE" }}>
              Charges{`\n`}
              {formatMoney(summary.summary.totalCharges)}
            </Text>
            <Text style={{ color: "#DBEAFE" }}>
              Payments{`\n`}
              {formatMoney(summary.summary.totalPayments)}
            </Text>
          </View>
        </View>
      ) : null}

      <Pressable
        onPress={() =>
          navigation.navigate("CustomerForm", { customerId: customer.id })
        }
        style={{ marginTop: 12 }}
      >
        <Text style={{ color: colors.primary, fontWeight: "700" }}>
          Edit customer details
        </Text>
      </Pressable>
      <Text style={[styles.sectionTitle, { marginTop: 22, marginBottom: 10 }]}>
        Record an activity
      </Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "#FFF7ED",
            padding: 15,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#FED7AA",
          }}
          onPress={() =>
            navigation.navigate("TransactionForm", {
              customerId,
              initialType: "CHARGE",
            })
          }
        >
          <Text
            style={{ color: colors.warning, fontWeight: "800", fontSize: 15 }}
          >
            Add charge
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
            Customer owes more
          </Text>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "#DCFCE7",
            padding: 15,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#BBF7D0",
          }}
          onPress={() =>
            navigation.navigate("TransactionForm", {
              customerId,
              initialType: "PAYMENT",
            })
          }
        >
          <Text
            style={{ color: colors.success, fontWeight: "800", fontSize: 15 }}
          >
            Record payment
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
            Customer paid you
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 26, marginBottom: 6 }]}>
        Transaction history
      </Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { marginBottom: 8, padding: 14 }]}>
            <Text
              style={{
                fontWeight: "800",
                color: item.type === "PAYMENT" ? colors.success : colors.ink,
              }}
            >
              {item.type}
            </Text>
            <Text
              style={{ color: colors.ink, fontWeight: "800", marginTop: 4 }}
            >
              {formatMoney(item.amount)}
            </Text>
            <Text style={{ color: colors.muted, marginTop: 3 }}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
            {item.description ? <Text>{item.description}</Text> : null}
            {item.paymentMethod ? <Text>{item.paymentMethod}</Text> : null}
            {item.reason ? <Text>{item.reason}</Text> : null}
          </View>
        )}
      />
    </ScrollView>
  );
}
