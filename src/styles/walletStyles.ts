import { StyleSheet, Dimensions } from "react-native";

export const mm = (n: number) => (n / 25.4) * 160;

export const EDGE_MM = 3;
export const GAP_MM  = 2.0;
export const EDGE = mm(EDGE_MM);
export const GAP  = mm(GAP_MM);
export const HALF_GAP = GAP / 2;

export const CARD_W_MM = 30;
export const CARD_H_MM = 30;                
export const CARD_HEIGHT = Math.round(mm(CARD_H_MM));

const W = Dimensions.get("window").width;
const desired = Math.round(mm(CARD_W_MM));
const maxByScreen = Math.floor((W - EDGE * 2 - GAP) / 2);
export const CARD_WIDTH = Math.min(desired, maxByScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0, 
    paddingTop: 30,
    shadowColor: "#313131ff",
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
  },

  searchOuter: { paddingHorizontal: EDGE },
  inputBase: {
    width: "100%",
    borderWidth: 3,
    borderColor: "#313bae61",
    borderRadius: 20,
    backgroundColor: "#e3f8f2fc",
    marginBottom: 16,
    shadowColor: "#313131ff",
    shadowOpacity: 0.5,
    shadowOffset: { width: 3, height: 6 },
    shadowRadius: 2,
  },
  inputFocused: {
    borderColor: "#ffffff",
    borderWidth: 2,
    borderRadius: 20,
    shadowColor: "#ffffffff",
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
  },
  inputField: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 18,
    fontFamily: "ArchitectsDaughter",
    color: "#246396",
    backgroundColor: "transparent",
  },
  cardGridList: {
    paddingTop: 12,
    paddingBottom: 90,
    paddingHorizontal: Math.max(0, EDGE - HALF_GAP), 
  },
  cardTileWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: HALF_GAP,
    marginBottom: GAP,
  },
  miniCard: {
    width: "100%",
    height: CARD_HEIGHT,
    backgroundColor: "#fff176",
    borderRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    shadowColor: "#313131ff",
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
    shadowRadius: 6,
  },
  miniCardBack: {
    width: "100%",
    height: CARD_HEIGHT,
    backgroundColor: "#faef8dff",
    borderRadius: 20,
    padding: 12,
    justifyContent: "center",
    shadowColor: "#313131ff",
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
    shadowRadius: 6,
  },
  miniWord: {
    fontFamily: "ArchitectsDaughter",
    fontSize: 24,
    textAlign: "center",
    color: "#246396",
  },
  miniPhonetic: {
    marginTop: 6,
    minHeight: 22,                    
    textAlign: "center",
    fontFamily: "ArchitectsDaughter",
    fontSize: 16,
    color: "#246396",
  },
  miniActionsRow: {
    marginTop: "auto",
    paddingBottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  miniDefinition: {
    fontFamily: "ArchitectsDaughter",
    fontSize: 16,
    color: "#246396",
    textAlign: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#313131ff",
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
  },
  navItem: { alignItems: "center", justifyContent: "center", flex: 1 },
  navText: {
    fontSize: 14,
    color: "#93cbf9ff",
    fontFamily: "ArchitectsDaughter",
    marginTop: 4,
    textAlign: "center",
    width: "100%",
  },
  returnCircleBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnHalo: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    opacity: 0,
  },
  returnHaloOn: {
    opacity: 0.85,
  },
  returnCirclePressed: {
    transform: [{ scale: 0.95 }],
  },
  userWrapper: { alignItems: "center", justifyContent: "flex-start", marginRight: 5, paddingTop: 5, minWidth: 60, top: -5 },
  userLabel: { fontSize: 14, color: "#246396", fontFamily: "ArchitectsDaughter", marginTop: -5, textAlign: "center" },
  initialsCircle: {
    backgroundColor: "#97d0feff",
    borderColor: "#246396",
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1.5,
  },
  initialsText: { fontFamily: "ArchitectsDaughter", color: "#246396", fontWeight: "bold", fontSize: 18 },

  iconButton: { justifyContent: "center", alignItems: "center" },
  iconButtonActive: {
    shadowColor: "#ffffff",
    shadowOpacity: 1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 4,
    borderRadius: 18,
  },
  iconGlyphGlow: { textShadowColor: "#ffffff", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },

});

export default styles;
export { CARD_WIDTH, CARD_HEIGHT };
