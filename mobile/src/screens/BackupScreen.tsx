import React, { useState } from "react";
import { View, Text, Button, TextInput, ScrollView, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { exportBackup, restoreBackup } from "../api";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Backup">;

export default function BackupScreen({ navigation }: Props) {
  const [backupText, setBackupText] = useState("{}");
  const [exportResult, setExportResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const data = await exportBackup();
      setBackupText(JSON.stringify(data, null, 2));
      setExportResult("Backup exported successfully.");
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Failed to export backup");
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore() {
    try {
      const parsed = JSON.parse(backupText);
      setLoading(true);
      await restoreBackup(parsed);
      Alert.alert("Success", "Backup restored successfully.");
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Invalid backup JSON");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Backup</Text>
      <View style={{ marginTop: 16 }}>
        <Button title={loading ? "Processing..." : "Export Backup"} onPress={handleExport} disabled={loading} />
        {exportResult ? <Text style={{ marginTop: 12 }}>{exportResult}</Text> : null}
      </View>
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontWeight: "600" }}>Backup JSON</Text>
        <TextInput
          value={backupText}
          onChangeText={setBackupText}
          multiline
          numberOfLines={12}
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 8, minHeight: 220, textAlignVertical: "top" }}
        />
      </View>
      <View style={{ marginTop: 16 }}>
        <Button title={loading ? "Processing..." : "Restore Backup"} onPress={handleRestore} disabled={loading} />
      </View>
    </ScrollView>
  );
}
