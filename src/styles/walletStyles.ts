import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  searchBar: {
    backgroundColor: "#ffffffdd",
    borderRadius: 30,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderWidth: 3,
    borderColor: "#acb5fbf3",
    gap: 12,
  },
  cardList: {
    gap: 12,
    paddingBottom: 80,
  },
  cardRow: {
    backgroundColor: "#ade6a7bb",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#246396",
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
  
  initialsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#9099f6c1',  
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderColor: '#2c6f33', 
    borderWidth: 1.5,
  },

  initialsText: {
  fontFamily: 'ArchitectsDaughter-Regular',
  color: "#246396",
  fontWeight: 'bold',
  fontSize: 18,
},

  minusButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffe6e6', 
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#990000',
  },

  minusText: {
    color: '#f10909ff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  termText: {
  fontFamily: 'ArchitectsDaughter-Regular',
  fontSize: 18,
  color: '#2c6f33', 
  
  fontWeight: 'normal',
},
navText: {
  fontSize: 16,
  color: '#246396', 
  fontFamily: 'ArchitectsDaughter-Regular',
  marginTop: 4,
},
});

export default styles;
