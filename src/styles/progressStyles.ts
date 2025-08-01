import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  placeholderButton: {
    width: 32,
    height: 32,
    backgroundColor: "#888",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  label: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 40,
    textAlign: "right",
  },
  homeLink: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  homeLinkText: {
    color: "blue",
    fontSize: 16,
  },
  initialsCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#87CEFA',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
  borderColor: '#2c6f33',
  borderWidth: 1.5,
},
initialsText: {
  fontFamily: 'ArchitectsDaughter-Regular',
  color: '#2c6f33',
  fontWeight: 'bold',
  fontSize: 18,
},
});

export default styles;