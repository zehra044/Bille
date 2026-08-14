import "react-native-url-polyfill/auto";
import React from "react";
import {
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import HomeScreen from "./src/screens/HomeScreen";
import CustomersListScreen from "./src/screens/CustomersListScreen";
import CustomerDetailScreen from "./src/screens/CustomerDetailScreen";
import CustomerFormScreen from "./src/screens/CustomerFormScreen";
import TransactionFormScreen from "./src/screens/TransactionFormScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ReportsScreen from "./src/screens/ReportsScreen";
import TrashScreen from "./src/screens/TrashScreen";
import BackupScreen from "./src/screens/BackupScreen";
import MoreScreen from "./src/screens/MoreScreen";

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  CustomerDetail: { customerId: string; refreshKey?: number };
  CustomerForm: { customerId?: string };
  TransactionForm: {
    customerId: string;
    initialType?: "CHARGE" | "PAYMENT" | "ADJUSTMENT";
  };
};

export type MainTabParamList = {
  Home: undefined;
  Customers: undefined;
  Dashboard: undefined;
  Reports: undefined;
  Trash: undefined;
  Backup: undefined;
  More: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#667085",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#E4E7EC",
          height: 64,
          paddingTop: 4,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof MaterialIcons>["name"] =
            "home";

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Customers") {
            iconName = "people";
          } else if (route.name === "Dashboard") {
            iconName = "dashboard";
          } else if (route.name === "Reports") {
            iconName = "bar-chart";
          } else if (route.name === "Trash") {
            iconName = "delete";
          } else if (route.name === "Backup") {
            iconName = "backup";
          } else if (route.name === "More") {
            iconName = "menu";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Customers" component={CustomersListScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{ title: "More", tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Trash"
        component={TrashScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Backup"
        component={BackupScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
