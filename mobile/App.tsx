import "react-native-url-polyfill/auto";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import CustomersListScreen from "./src/screens/CustomersListScreen";
import CustomerDetailScreen from "./src/screens/CustomerDetailScreen";
import CustomerFormScreen from "./src/screens/CustomerFormScreen";
import TransactionFormScreen from "./src/screens/TransactionFormScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ReportsScreen from "./src/screens/ReportsScreen";
import TrashScreen from "./src/screens/TrashScreen";
import BackupScreen from "./src/screens/BackupScreen";

export type RootStackParamList = {
  Home: undefined;
  Customers: undefined;
  CustomerDetail: { customerId: string };
  CustomerForm: { customerId?: string };
  TransactionForm: { customerId: string };
  Dashboard: undefined;
  Reports: undefined;
  Trash: undefined;
  Backup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Customers" component={CustomersListScreen} />
        <Stack.Screen
          name="CustomerDetail"
          component={CustomerDetailScreen}
          options={{ title: "Customer" }}
        />
        <Stack.Screen
          name="CustomerForm"
          component={CustomerFormScreen}
          options={{ title: "Customer form" }}
        />
        <Stack.Screen
          name="TransactionForm"
          component={TransactionFormScreen}
          options={{ title: "New Transaction" }}
        />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="Trash" component={TrashScreen} />
        <Stack.Screen name="Backup" component={BackupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
