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
    borderRadius: 30,
    padding: 14,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#acb5fbf3",
    marginBottom: 18,
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
  },
  longInput: {
    backgroundColor: "#ffffffdd",
    borderRadius: 30,
    padding: 14,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#acb5fbf3",
    height: 150, // ≈3см
    textAlignVertical: 'top',
    marginBottom: 18,
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
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
    fontFamily: 'ArchitectsDaughter-Regular',
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
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
  userLabel: {
    fontSize: 16,
    color: '#246396',
    fontFamily: 'ArchitectsDaughter-Regular',
    marginTop: -4,
    textAlign: 'center',
  },

  dropdownWrapper: {
    position: 'relative',
    zIndex: 10,
    marginBottom: 40, // чтобы список не перекрывал следующее поле
  },

  dropdownHeader: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#313131ff',
    shadowOpacity: 0.5,
    shadowOffset: { width: 3, height: 6 },
    zIndex: 11,
  },

  dropdownArrow: {
    fontSize: 18,
    color: '#246396',
    fontFamily: 'ArchitectsDaughter-Regular',
  },

  dropdownHeaderText: {
    fontSize: 16,
    color: '#848687ff',
    // fontFamily: 'ArchitectsDaughter-Regular',
  },

  dropdownOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#ffffffee',
    borderRadius: 20,
    maxHeight: 200,
    zIndex: 100,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
  },

  dropdownList: {
    paddingVertical: 6,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  dropdownItemSelected: {
    backgroundColor: '#acb5fbf3',
    borderRadius: 10,
  },

  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'ArchitectsDaughter-Regular',
    color: '#246396',
  }

});

export default styles;