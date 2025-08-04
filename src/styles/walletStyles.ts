import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 4, height: 6 },
  },
  searchBar: {
    backgroundColor: "#ffffffdd",
    borderRadius: 30,
    padding: 10,
    marginBottom: 30,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderWidth: 3,
    borderColor: "#acb5fbf3",
    gap: 12,
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
  },
  cardList: {
    gap: 12,
    paddingBottom: 80,
  },
  cardRow: {
    backgroundColor: "#cef4caf0",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#246396",
    gap: 12,
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 1, height: 1 },
    width: '99%',
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
  initialsCircle: {
    backgroundColor: '#97d0feff',
    borderColor: '#246396',
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#f90606ff',
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
  bottomBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around", // равномерное распределение
    alignItems: "center",
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 4, height: 6 },
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  navText: {
    fontSize: 14,
    color: '#93cbf9ff',
    fontFamily: 'ArchitectsDaughter-Regular',
    marginTop: 4,
    textAlign: 'center',
    width: '100%', // добавлено для центрирования многострочных надписей
  },
  userWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 8,
    paddingTop: 8, // ← ОТДВИГАЕТ ВЕСЬ БЛОК ОТ ПОТОЛКА
    minWidth: 60, // ← ФИКСИРУЕТ ширину, чтобы текст и кружок совпадали
  },
  userLabel: {
    fontSize: 16,
    color: '#246396',
    fontFamily: 'ArchitectsDaughter-Regular',
    marginTop: -2,
    textAlign: 'center',
  },


});

export default styles;
