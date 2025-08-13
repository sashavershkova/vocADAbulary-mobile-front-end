import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
  memo,
  useRef,
} from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMockUser } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import {
  getLearnedFlashcards,
  updateWalletFlashcardStatus,
} from "../api/wallet";
import styles, { CARD_HEIGHT } from "../styles/walletStyles";
import { LinearGradient } from "expo-linear-gradient";

type LearnedNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "LearnedCards"
>;

type LearnedCard = {
  id: number;
  word: string;
  status: string;
  lastReviewed: string;
};

const LearnedFlashcardsScreen = () => {
  const navigation = useNavigation<LearnedNavProp>();
  const { user } = useMockUser();
  const userId = user.id;
  const initials = user.username?.charAt(0).toUpperCase() || "?";

  const [searchFocused, setSearchFocused] = useState(false);
  const [flashcards, setFlashcards] = useState<LearnedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const searchInputRef = useRef<TextInput>(null);

  const dismiss = useCallback(() => {
    Keyboard.dismiss();
    searchInputRef.current?.blur();
    setSearchFocused(false);
  }, []);

  const fetchLearned = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLearnedFlashcards(userId);
      const learned = data.map((item: any) => ({
        id: item.flashcardId,
        word: item.word,
        status: item.status,
        lastReviewed: item.lastReviewed,
      })) as LearnedCard[];
      setFlashcards(learned);
    } catch (error) {
      console.error("Error fetching learned:", error);
      Alert.alert("Error", "Could not load learned flashcards.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "PIGGY BANK",
      headerStyle: { backgroundColor: "#b0f4c9ff" },
      headerTitleStyle: {
        color: "#246396",
        fontFamily: "ArchitectsDaughter",
        fontSize: 36,
      },
      headerRight: () => (
        <View style={styles.userWrapper}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
          <Text style={styles.userLabel}>User</Text>
        </View>
      ),
    });
  }, [navigation, initials]);

  useEffect(() => {
    fetchLearned();
  }, [fetchLearned]);

  const moveBackToMainDeck = useCallback(
    async (id: number) => {
      try {
        await updateWalletFlashcardStatus(userId, id, "IN_PROGRESS");
        fetchLearned();
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Could not move flashcard.");
      }
    },
    [userId, fetchLearned]
  );

  const filteredFlashcards = flashcards.filter((fc) =>
    fc.word.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  const MiniLearned = memo(
    function MiniLearned({
      item,
      onUnwallet,
    }: {
      item: LearnedCard;
      onUnwallet: (id: number) => void;
    }) {
      return (
        <View style={styles.cardTileWrapper}>
          <View style={{ height: CARD_HEIGHT }}>
            <View style={styles.miniCard}>
              <View
                style={{
                  flexGrow: 1,
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[styles.miniWord, { fontFamily: "ArchitectsDaughter" }]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  adjustsFontSizeToFit
                  minimumFontScale={0.78}
                >
                  {item.word}
                </Text>
              </View>

              <View style={[styles.miniActionsRow, { justifyContent: "center" }]}>
                <View style={S.btnWrap}>
                  <Pressable
                    onPress={() => onUnwallet(item.id)}
                    hitSlop={10}
                    style={({ pressed }) => [
                      S.btnPressArea,
                      pressed && S.btnPressAreaPressed,
                    ]}
                  >
                    {({ pressed }) => (
                      <>
                        <View style={[S.halo, pressed && S.haloOn]} />
                        <View style={[S.circle, pressed && S.circlePressed]}>
                          <Ionicons
                            name="return-up-back"
                            size={22}
                            color="#246396"
                            style={pressed && styles.iconGlyphGlow}
                          />
                        </View>
                      </>
                    )}
                  </Pressable>
                  <Text style={S.label}>UNWALLET</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    },
    (prev, next) =>
      prev.item.id === next.item.id &&
      prev.item.word === next.item.word &&
      prev.onUnwallet === next.onUnwallet
  );

  return (
    <View
      style={{ flex: 1 }}
      onStartShouldSetResponder={() => searchFocused}
      onResponderRelease={dismiss}
    >
      <LinearGradient colors={["#b0f4c9ff", "#313bae8c"]} style={styles.container}>
        <View style={styles.searchOuter}>
          <View style={[styles.inputBase, searchFocused && styles.inputFocused]}>
            <TextInput
              ref={searchInputRef}
              style={styles.inputField}
              placeholder="Search in learned..."
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              returnKeyType="search"
            />
          </View>
        </View>

        <FlatList
          data={filteredFlashcards}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "flex-start" }}
          contentContainerStyle={styles.cardGridList}
          renderItem={({ item }) => (
            <MiniLearned item={item} onUnwallet={moveBackToMainDeck} />
          )}
          ListFooterComponent={<View style={{ height: 100 }} />}
          style={{ marginBottom: 90 }}
          removeClippedSubviews={false}
          keyboardDismissMode="on-drag"      
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={dismiss}
        />

        <View style={styles.bottomBar} pointerEvents="box-none">
          <Pressable
            onPress={() => {
              dismiss();
              navigation.navigate("Home");
            }}
            hitSlop={10}
            style={({ pressed }) => [styles.navItem, pressed && styles.iconButtonActive]}
          >
            <Ionicons name="home" size={35} color="#97d0feff" />
            <Text style={styles.navText}>HOME</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
};

export default LearnedFlashcardsScreen;

const S = StyleSheet.create({
  btnWrap: { alignItems: "center", justifyContent: "center" },
  btnPressArea: { alignItems: "center", justifyContent: "center" },
  btnPressAreaPressed: {},
  halo: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    opacity: 0,
  },
  haloOn: { opacity: 0.85 },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#93cbf9ff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#313131ff",
    shadowOpacity: 0.8,
    shadowOffset: { width: 3, height: 6 },
  },
  circlePressed: { transform: [{ scale: 0.95 }] },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: "#246396",
    textAlign: "center",
    fontFamily: "ArchitectsDaughter",
  },
});
