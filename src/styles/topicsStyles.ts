import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topicList: {
    paddingBottom: 20,
  },
  topicBoxWrapper: {
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
  },
  topicTouchable: {
    borderRadius: 40,
    overflow: 'visible',
    // shadowColor: '#313131ff',
    // shadowOpacity: 0.8,
    // shadowOffset: { width: 3, height: 6 },
  },
  topicBox: {
    width: 300,
    height: 80,
    borderRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  topicText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ArchitectsDaughter',
    color: '#006400',
  },
  topicTextActive: {
    color: '#b67ef6ff',
    textShadowColor: '#006400',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
  topicShadowWrapper: {
    shadowColor: '#006400',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleButton: {
    backgroundColor: '#F8C8DC',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#006400',
    marginTop: 30,
  },
  simpleButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006400',
    fontFamily: 'ArchitectsDaughter',
  },
  initialsCircle: {
    backgroundColor: '#8feda0ff',
    borderColor: '#2c6f33',
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
  },
  initialsText: {
    fontFamily: 'ArchitectsDaughter',
    color: '#2c6f33',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#313131ff',
    shadowOpacity: 0.8,
    shadowOffset: { width: 4, height: 6 },
  },
  // homeButton: {
  //   alignItems: 'center',
    
  // },
  addButton: {
    width: 56,
    height: 56,
    backgroundColor: '#9edd81ff',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#006400',
    marginTop: 4,
    fontFamily: 'ArchitectsDaughter',
    fontSize: 14,
  },
  userWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 8,
    paddingTop: 8,
    minWidth: 60,
  },
  userLabel: {
    fontSize: 14,
    color: '#2c6f33',
    fontFamily: 'ArchitectsDaughter',
    marginTop: -5,
    textAlign: 'center',
  },
  navText: {
    fontSize: 16,
    fontFamily: 'ArchitectsDaughter',
    color: '#8feda0ff',
    textAlign: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginHorizontal: 10,
  },

  /** 🔍 Search Feature Styles **/
  navItemCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e7ffe8',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#8feda0ff',
    shadowColor: '#2c6f33',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  navTextCenter: {
    fontSize: 16,
    color: '#2c6f33',
    fontFamily: 'ArchitectsDaughter',
    marginTop: 4,
    letterSpacing: 1,
  },
  searchModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.20)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 105,
  },
  searchModalContainer: {
    backgroundColor: '#fae6ffff',
    padding: 24,
    borderRadius: 18,
    width: 340,
    maxHeight: '80%',
    shadowColor: '#333',
    shadowOpacity: 0.18,
    shadowOffset: { width: 2, height: 6 },
  },
  searchModalTitle: {
    fontFamily: 'ArchitectsDaughter',
    fontSize: 24,
    marginBottom: 8,
    color: '#2c6f33',
    textAlign: 'center',
  },
  searchInput: {
    borderColor: '#2c6f33',
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 8,
    fontSize: 18,
    fontFamily: 'ArchitectsDaughter',
    marginBottom: 12,
  },
  noResultsText: {
    color: '#777',
    fontFamily: 'ArchitectsDaughter',
    marginBottom: 8,
    textAlign: 'center',
  },
  searchResultBox: {
    padding: 8,
    backgroundColor: '#eaffea',
    borderRadius: 7,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#b8efb7',
  },
  searchResultWord: {
    fontFamily: 'ArchitectsDaughter',
    fontSize: 18,
    color: '#2c6f33',
  },
  searchResultDef: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'ArchitectsDaughter',
  },
  searchCloseBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  searchCloseText: {
    color: '#767776ff',
    fontFamily: 'ArchitectsDaughter',
    fontSize: 18,
    fontWeight: 'bold',
  },
// КНОПКА (пилюля) — статическое состояние
pillButton: {
  minWidth: 80,
  height: 56,
  paddingHorizontal: 22,
  borderRadius: 40,                 // максимально скруглённая
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,

  backgroundColor: '#e2a4f7ee',
  borderWidth: 1.5,
  borderColor: '#2c6f33',

  // статичная тень
  shadowColor: '#313131ff',
  shadowOpacity: 0.8,
  shadowOffset: { width: 3, height: 6 },
  shadowRadius: 6,
  elevation: 6,
},

// КНОПКА — активное (динамическое) состояние
pillButtonActive: {
  // белая «светящаяся» тень
  shadowColor: '#ffffffff',
  shadowOpacity: 0.95,
  shadowOffset: { width: 0, height: 8 },
  shadowRadius: 10,
  elevation: 12,
},

// ИНФО-ПОВЕРХНОСТЬ (не кнопка)
infoSurface: {
  borderRadius: 16,                // односкругление для всех не-кнопок
  backgroundColor: '#cef4caf0',
  borderWidth: 1,
  borderColor: '#246396',
  paddingVertical: 10,
  paddingHorizontal: 20,

  shadowColor: '#313131ff',
  shadowOpacity: 0.8,
  shadowOffset: { width: 3, height: 6 },
},


});

export default styles;