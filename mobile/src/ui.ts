import { StyleSheet } from "react-native";

export const colors = {
  ink: "#172033",
  muted: "#667085",
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  canvas: "#F6F8FC",
  surface: "#FFFFFF",
  border: "#E4E7EC",
  success: "#15803D",
  danger: "#DC2626",
  warning: "#B45309",
};

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 20, paddingBottom: 32 },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: "800", letterSpacing: 1.1, textTransform: "uppercase" },
  title: { color: colors.ink, fontSize: 28, fontWeight: "800", letterSpacing: -0.6 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: "800" },
  empty: { color: colors.muted, textAlign: "center", marginTop: 28 },
});

export function formatMoney(amount: string | number) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("en", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(
    Number.isFinite(value) ? value : 0
  );
}
