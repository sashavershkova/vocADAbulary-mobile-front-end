import React, { useEffect, useState, useLayoutEffect, useRef, useCallback, memo } from "react";
import {
  Animated,
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  Pressable,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import { RootStackParamList } from "../types/navigation";
import { getWalletFlashcards, removeFromWallet, updateWalletFlashcardStatus } from "../api/wallet";
import {
  ensureCacheDirExists,
  getCachedAudioPath,
  isAudioCached,
  fetchAndCacheTTS,
  playTTS,
} from "../utils/ttsUtils";
import PopoverHint from "./PopoverHint";
import { useMockUser } from "../context/UserContext";
import api from "../api/axiosInstance";

import styles, { CARD_HEIGHT } from "../styles/walletStyles";
import bluestick from "../assets/images/bluestick.png";

type WalletNavProp = NativeStackNavigationProp<RootStackParamList, "Wallet">;

type WalletFlashcard = {
  id: number;
  word: string;
  definition: string;
  status: string;
  lastReviewed: string;
  audioUrl?: string;
  phonetic?: string;
};

const WalletScreen: React.FC = () => {
  const navigation = useNavigation<WalletNavProp>();
  const { user } = useMockUser();
  const userId = user.id;
  const initials = user.username?.charAt(0).toUpperCase() || "?";

  const [flashcards, setFlashcards] = useState<WalletFlashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const [hintVisible, setHintVisible] = useState(false);
  const stickScale = useRef(new Animated.Value(1)).current;
  const hasEnsuredDir = useRef(false);
  const searchInputRef = useRef<TextInput>(null);

  const dismiss = useCallback(() => {
    Keyboard.dismiss();
    searchInputRef.current?.blur();
    setSearchFocused(false);
  }, []);

  const fetchWallet = useCallback(async () => {
    if (!hasEnsuredDir.current) {
      await ensureCacheDirExists();
      hasEnsuredDir.current = true;
    }
    try {
      setLoading(true);
      const data = await getWalletFlashcards(userId);
      const normalized: WalletFlashcard[] = data.map((item: any) => ({
        id: item.flashcardId,
        word: item.word,
        definition: item.definition,
        status: item.status,
        lastReviewed: item.lastReviewed,
        audioUrl: item.audioUrl,
        phonetic: item.phonetic ?? undefined,
      }));
      setFlashcards(normalized);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      Alert.alert("Error", "Could not load wallet flashcards.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "WALLET",
      headerStyle: { backgroundColor: "#b0f4c9ff" },
      headerTitleStyle: { color: "#246396", fontFamily: "ArchitectsDaughter", fontSize: 40 },
      headerLeft: () => (
        <Pressable
          onPress={() => {
            Animated.sequence([
              Animated.timing(stickScale, { toValue: 0.5, duration: 100, useNativeDriver: true }),
              Animated.timing(stickScale, { toValue: 1, duration: 100, useNativeDriver: true }),
            ]).start(() => setHintVisible(true));
          }}
          style={{ marginLeft: 16, padding: 2 }}
        >
          <Animated.Image
            source={bluestick}
            style={{ width: 30, height: 50, transform: [{ scale: stickScale }] }}
          />
        </Pressable>
      ),
      headerRight: () => (
        <View style={styles.userWrapper}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
          <Text style={styles.userLabel}>User</Text>
        </View>
      ),
    });
  }, [navigation, initials, stickScale]);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await removeFromWallet(userId, id);
        fetchWallet();
      } catch {
        Alert.alert("Error", "Could not remove flashcard.");
      }
    },
    [userId, fetchWallet]
  );

  const handleLearned = useCallback(
    async (id: number) => {
      try {
        await updateWalletFlashcardStatus(userId, id, "LEARNED");
      } finally {
        fetchWallet();
      }
    },
    [userId, fetchWallet]
  );

  const filteredFlashcards = flashcards.filter((fc) =>
    fc.word.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  type MiniProps = {
    item: WalletFlashcard;
    onDelete: (id: number) => void;
    onLearned: (id: number) => void;
  };

  const MiniCardInner: React.FC<MiniProps> = ({ item, onDelete, onLearned }) => {
    const flip = useRef(new Animated.Value(0)).current;
    const [flipped, setFlipped] = useState(false);

    const [localPhon, setLocalPhon] = useState(item.phonetic ?? "");
    const phonToShow = localPhon || item.phonetic || "";

    const [playing, setPlaying] = useState(false);

    const front = flip.interpolate({ inputRange: [0, 180], outputRange: ["0deg", "180deg"] });
    const back = flip.interpolate({ inputRange: [0, 180], outputRange: ["180deg", "360deg"] });

    const toggle = () => {
      Animated.spring(flip, {
        toValue: flipped ? 0 : 180,
        useNativeDriver: true,
        friction: 8,
        tension: 10,
      }).start();
      setFlipped((v) => !v);
    };

    useEffect(() => {
      if (!localPhon) {
        api
          .get(`/api/flashcards/${item.id}`)
          .then(({ data }) => data?.phonetic && setLocalPhon(String(data.phonetic)))
          .catch(() => {});
      }
    }, [item.id, localPhon]);

    const playLocal = async () => {
      if (playing) return;
      setPlaying(true);
      try {
        const audioPath = getCachedAudioPath(item.id);
        const cached = await isAudioCached(item.id);
        if (!cached) await fetchAndCacheTTS(item.id);
        await playTTS(audioPath);
      } catch {
        Alert.alert("Error", "Could not generate audio.");
      } finally {
        setPlaying(false);
      }
    };

    return (
      <View style={styles.cardTileWrapper}>
        <View style={{ height: CARD_HEIGHT }}>
          {/* FRONT */}
          <Animated.View
            style={[
              styles.miniCard,
              { backfaceVisibility: "hidden", transform: [{ perspective: 1000 }, { rotateY: front }] },
            ]}
            pointerEvents={flipped ? "none" : "auto"}
          >
            <Pressable
              style={{ flexGrow: 1, width: "100%", alignItems: "center", justifyContent: "center" }}
              onPress={toggle}
            >
              <Text
                style={styles.miniWord}
                numberOfLines={2}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                minimumFontScale={0.78}
              >
                {item.word}
              </Text>

              <View style={{ minHeight: 22, justifyContent: "center" }}>
                {phonToShow !== "" && <Text style={styles.miniPhonetic}>/{phonToShow}/</Text>}
              </View>
            </Pressable>

            <View style={styles.miniActionsRow}>
              <Pressable
                onPress={(e) => {
                  (e as any)?.stopPropagation?.();
                  playLocal();
                }}
                hitSlop={10}
                style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonActive]}
              >
                {playing ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Ionicons name="volume-high" size={22} color="rgba(216,129,245,1)" style={styles.iconGlyphGlow} />
                )}
              </Pressable>

              <Pressable
                onPress={(e) => {
                  (e as any)?.stopPropagation?.();
                  onLearned(item.id);
                }}
                hitSlop={10}
                style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonActive]}
              >
                <Ionicons name="checkmark-circle" size={22} color="rgba(216,129,245,1)" style={styles.iconGlyphGlow} />
              </Pressable>

              <Pressable
                onPress={(e) => {
                  (e as any)?.stopPropagation?.();
                  onDelete(item.id);
                }}
                hitSlop={10}
                style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonActive]}
              >
                <Ionicons name="remove-circle" size={22} color="rgba(216,129,245,1)" style={styles.iconGlyphGlow} />
              </Pressable>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.miniCardBack,
              { position: "absolute", top: 0, backfaceVisibility: "hidden", transform: [{ perspective: 1000 }, { rotateY: back }] },
            ]}
            pointerEvents={flipped ? "auto" : "none"}
          >
            <Pressable style={{ flex: 1, justifyContent: "center" }} onPress={toggle}>
              <Text style={styles.miniDefinition} numberOfLines={3}>
                {item.definition}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    );
  };

  const MiniCard = memo(MiniCardInner, (prev, next) => {
    return (
      prev.item.id === next.item.id &&
      prev.item.word === next.item.word &&
      prev.item.definition === next.item.definition &&
      prev.item.phonetic === next.item.phonetic
    );
  });

  return (
    <View
      style={{ flex: 1 }}
      onStartShouldSetResponder={() => searchFocused}
      onResponderRelease={dismiss}
    >
      <LinearGradient colors={["#b0f4c9ff", "#313bae8c"]} style={styles.container}>
        <PopoverHint visible={hintVisible} onClose={() => setHintVisible(false)}>
          <Text style={styles.text}>
            Welcome to your *WALLET* — where your favorite flashcards live happily ever after (until you delete them, you monster).{"\n\n"}
            These are your PERSONAL MVPs, handpicked from the Learn section.{"\n"}
            You can replay them endlessly, because repetition is key — just ask Sheldon, who's watched Star Trek 193 times.{"\n\n"}
            But wait, there's more:{"\n"}
            - Want to CREATE your own nerdy masterpiece? Go for it — unleash your inner Amy Farrah Fowler, ADD a new card.{"\n"}
            - Need to TRACK what you've mastered? Slide over to the *PIGGY BANK* — it's like your brain's trophy shelf.{"\n\n"}
            TL;DR: This is your Word Fortress. Customize it, listen to it, and flaunt it like Howard flaunts his belt buckles.{"\n\n"}
            Fun fact: Unlike Raj, you can totally speak here — just press play.
          </Text>
        </PopoverHint>

        <View style={styles.searchOuter}>
          <View style={[styles.inputBase, searchFocused && styles.inputFocused]}>
            <TextInput
              ref={searchInputRef}
              style={styles.inputField}
              placeholder="Search in wallet..."
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
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "flex-start" }}
          contentContainerStyle={styles.cardGridList}
          renderItem={({ item }) => (
            <MiniCard item={item} onDelete={handleDelete} onLearned={handleLearned} />
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
            {({ pressed }) => (
              <>
                <Ionicons name="home" size={35} color="#97d0feff" style={pressed && styles.iconGlyphGlow} />
                <Text style={styles.navText}>HOME</Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              dismiss();
              navigation.navigate("NewFlashcard" as never, { topicId: 0 } as never);
            }}
            hitSlop={10}
            style={({ pressed }) => [styles.navItem, pressed && styles.iconButtonActive]}
          >
            {({ pressed }) => (
              <>
                <Ionicons name="add-circle" size={35} color="#97d0feff" style={pressed && styles.iconGlyphGlow} />
                <Text style={styles.navText}>ADD</Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              dismiss();
              navigation.navigate("LearnedCards" as never);
            }}
            hitSlop={10}
            style={({ pressed }) => [styles.navItem, pressed && styles.iconButtonActive]}
          >
            {({ pressed }) => (
              <>
                <FontAwesome5 name="piggy-bank" size={35} color="#97d0feff" style={pressed && styles.iconGlyphGlow} />
                <Text style={styles.navText}>PIGGY BANK</Text>
              </>
            )}
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
};

export default WalletScreen;
