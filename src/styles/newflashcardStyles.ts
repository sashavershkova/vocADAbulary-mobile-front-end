import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
  },
  label: {
    fontSize: 22,
    marginBottom: 6,
    fontFamily: 'ArchitectsDaughter-Regular',
    color: '#246396',
  },
  input: {
    backgroundColor: "#ffffffdd",
    borderRadius: 20,
    padding: 14,
    fontSize: 20,
    borderWidth: 2,
    borderColor: "#313bae5f",
    marginBottom: 18,
    fontFamily: 'ArchitectsDaughter-Regular',
    shadowColor: '#313131ff',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
  },
  longInput: {
    backgroundColor: "#ffffffdd",
    borderRadius: 20,
    padding: 14,
    fontSize: 20,
    borderWidth: 2,
    borderColor: "#313bae5f",
    height: 150, // ≈3см
    textAlignVertical: 'top',
    fontFamily: 'ArchitectsDaughter',
    marginBottom: 18,
    shadowColor: '#313131ff',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
  },
  bottomBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 14,
    color: '#93cbf9ff',
    fontFamily: 'ArchitectsDaughter',
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  initialsCircle: {
    backgroundColor: '#97d0feff',
    borderColor: '#313bae8c',
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
  },
  initialsText: {
    fontFamily: 'ArchitectsDaughter',
    color: "#246396",
    fontWeight: 'bold',
    fontSize: 18,
  },
  userLabel: {
    fontSize: 14,
    color: '#313bae8c',
    fontFamily: 'ArchitectsDaughter',
    marginTop: -5,
    textAlign: 'center',
  },

  dropdownWrapper: {
    position: 'relative',
    zIndex: 10,
    marginBottom: 25, // чтобы список не перекрывал следующее поле
  },

  dropdownHeader: {
    backgroundColor: '#313bae28',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#313131ff',
    shadowOpacity: 0.5,
    shadowOffset: { width: 3, height: 6 },
    zIndex: 11,
    borderColor: "#313bae5f",
    borderWidth: 2, 
  },

  dropdownArrow: {
    fontSize: 25,
    color: '#246396',
  },

  dropdownHeaderText: {
    fontSize: 20,
    color: '#b0f4c9ff',
    fontFamily: 'ArchitectsDaughter',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 60,
    left: 15,
    right: 15,
    backgroundColor: '#b0f4c9ff',
    borderRadius: 10,
    maxHeight: 500,
    zIndex: 100,
  },
  dropdownList: {
    paddingVertical: 6,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  dropdownItemSelected: {
    backgroundColor: '#313bae5f',
    borderRadius: 10,
  },

  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'ArchitectsDaughter',
    color: '#246396',
  }

});

export default styles;