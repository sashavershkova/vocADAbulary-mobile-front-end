import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonGroup: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  metricButton: {
    width: '85%',
    backgroundColor: '#87CEFA',
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#4682B4',
  },
  metricText: {
    fontSize: 20,
    fontFamily: 'ArchitectsDaughter',
    color: '#246396ff',
  },
  buttonBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 4, height: 6 },
  },
  homeButton: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'ArchitectsDaughter',
    color: '#246396ff',
    marginTop: 4,
  },
  initialsCircle: {
    backgroundColor: '#87CEFA',
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
    color: '#246396',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 8,
    paddingTop: 8,
    minWidth: 60,
  },
  userLabel: {
    fontSize: 16,
    color: '#077bb4ff',
    fontFamily: 'ArchitectsDaughter-Regular',
    marginTop: -2,
    textAlign: 'center',
  },
  navText: {
    fontSize: 16,
    fontFamily: 'ArchitectsDaughter',
    color: '#82c0f3ff',
    textAlign: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginHorizontal: 10
  },
});

export default styles;
