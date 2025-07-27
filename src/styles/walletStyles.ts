import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  cardContent: { flex: 1, marginHorizontal: 10 },
  word: { fontWeight: "bold", fontSize: 16 },
  definition: { color: "#555", fontSize: 14 },
  actions: { flexDirection: "row", gap: 10 },
  actionButton: { color: "blue", marginHorizontal: 5 },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  bottomButton: { fontSize: 16, color: "blue" },
});