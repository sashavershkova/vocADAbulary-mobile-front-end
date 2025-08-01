import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  searchBar: {
    backgroundColor: "#ffffffdd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cardList: {
    gap: 12,
    paddingBottom: 80,
  },
  cardRow: {
    backgroundColor: "#ffffffcc",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#00640044",
    gap: 12,
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006400",
    flex: 1,
  },
  walletIcon: {
    width: 28,
    height: 28,
  },
  bottomBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#d9e365ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#254e34ff",
    fontWeight: "bold",
    fontSize: 16,
  },
  initialsCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#edf96cff',  // салатовый
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},

initialsText: {
  color: '#2c6f33ff',   // тёмно-зелёный
  fontWeight: 'bold',
  fontSize: 16,
},

minusButton: {
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: '#ffe6e6', // светло-красный фон
  justifyContent: 'center',
  alignItems: 'center',
  marginHorizontal: 6,
  borderWidth: 1,
  borderColor: '#990000',
},

minusText: {
  color: '#990000',
  fontSize: 20,
  fontWeight: 'bold',
  lineHeight: 24,
},
});

export default styles;
