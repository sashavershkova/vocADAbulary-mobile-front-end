import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useMockUser } from "../context/UserContext";
import {
  Animated, View, Text, TextInput, FlatList, Alert, Pressable, ActivityIndicator, Image,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import {
  getWalletFlashcards,
  removeFromWallet,
  updateWalletFlashcardStatus,
} from "../api/wallet";
import styles from "../styles/walletStyles";
import { LinearGradient } from "expo-linear-gradient";
import {
  ensureCacheDirExists,
  getCachedAudioPath,
  isAudioCached,
  fetchAndCacheTTS,
  playTTS,
} from "../utils/ttsUtils";
import bluestick from '../assets/images/bluestick.png';
import PopoverHint from '../screens/PopoverHint';

type WalletNavProp = NativeStackNavigationProp<RootStackParamList, "Wallet">;

type WalletFlashcard = {
  id: number;
  word: string;
  definition: string;
  status: string;
  lastReviewed: string;
  audioUrl?: string;
};

const WalletScreen = () => {
  const [hintVisible, setHintVisible] = useState(false);
  const stickScale = React.useRef(new Animated.Value(1)).current;

  const [searchFocused, setSearchFocused] = useState(false);

  const navigation = useNavigation<WalletNavProp>();
  const { user } = useMockUser();
  const userId = user.id;
  const username = user.username;
  const initials = username?.charAt(0).toUpperCase() || "?";

  const [flashcards, setFlashcards] = useState<WalletFlashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const hasEnsuredDir = useRef(false);
  const [ttsLoadingId, setTtsLoadingId] = useState<number | null>(null);


  const fetchWallet = async () => {
    if (!hasEnsuredDir.current) {
      await ensureCacheDirExists();
      hasEnsuredDir.current = true;
    }

    try {
      setLoading(true);
      const data = await getWalletFlashcards(userId);
      const normalized = data.map((item: any) => ({
        id: item.flashcardId,
        word: item.word,
        definition: item.definition,
        status: item.status,
        lastReviewed: item.lastReviewed,
        audioUrl: item.audioUrl,
      }));
      setFlashcards(normalized);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      Alert.alert("Error", "Could not load wallet flashcards.");
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "WALLET",
      headerStyle: {
        backgroundColor: "#b0f4c9ff",
      },
      headerTitleStyle: {
        color: "#246396",
        fontFamily: "ArchitectsDaughter",
        fontSize: 36,
      },
      headerLeft: () => (
        <Pressable
          onPress={() => {
            Animated.sequence([
              Animated.timing(stickScale, { toValue: 0.5, duration: 100, useNativeDriver: true }), // сжать вдвое
              Animated.timing(stickScale, { toValue: 1.0, duration: 100, useNativeDriver: true }), // вернуть норму
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
  }, [navigation, initials]);

  useEffect(() => {
    fetchWallet();
  }, []);

  const playAudio = async (flashcardId: number) => {
    const audioPath = getCachedAudioPath(flashcardId);
    setTtsLoadingId(flashcardId);

    try {
      const cached = await isAudioCached(flashcardId);
      if (!cached) {
        await fetchAndCacheTTS(flashcardId);
      }
      await playTTS(audioPath);
    } catch (err) {
      console.error(`Playback error for flashcard ${flashcardId}:`, err);
      Alert.alert('Error', 'Could not generate audio.');
    } finally {
      setTtsLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await removeFromWallet(userId, id);
      Alert.alert("Removed", "Flashcard removed from wallet.");
      fetchWallet();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not remove flashcard.");
    }
  };

  const markAsLearned = async (id: number) => {
    try {
      await updateWalletFlashcardStatus(userId, id, "LEARNED");
      Alert.alert("Updated", "Marked as learned.");
      fetchWallet();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not update flashcard.");
    }
  };

  const filteredFlashcards = flashcards.filter((fc) =>
    fc.word.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
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

    <View style={[styles.inputBase, searchFocused && styles.inputFocused]}>
      <TextInput
        style={styles.inputField}
        placeholder="Search in wallet..."
        value={searchText}
        onChangeText={setSearchText}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
      />
    </View>

    <FlatList
      data={filteredFlashcards}
      keyExtractor={(item) => item.id.toString()}
      style={{ marginBottom: 90 }}
      contentContainerStyle={styles.cardList}
      renderItem={({ item }) => (
        <View style={styles.cardRow}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Pressable
              onPress={() => playAudio(item.id)}
              hitSlop={10}
              android_ripple={{ borderless: true }}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonActive,
                { marginRight: 8 },
              ]}
            >
              {({ pressed }) =>
                ttsLoadingId === item.id ? (
                  <ActivityIndicator size="small" color="#97d0feff" />
                ) : (
                  <Ionicons
                    name="play-circle"
                    size={32}
                    color="#313bae8c"
                    style={pressed && styles.iconGlyphGlow}
                  />
                )
              }
            </Pressable>

            <Text style={styles.termText}>{item.word}</Text>
          </View>

          <View style={styles.iconRow}>
            <Pressable
              onPress={() => handleDelete(item.id)}
              hitSlop={10}
              android_ripple={{ borderless: true }}
              style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonActive]}
            >
              {({ pressed }) => (
                <Ionicons
                  name="remove-circle"
                  size={32}
                  color="#fb3030db"
                  style={pressed && styles.iconGlyphGlow}
                />
              )}
            </Pressable>

            <Pressable
              onPress={() => markAsLearned(item.id)}
              hitSlop={10}
              android_ripple={{ borderless: true }}
              style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonActive]}
            >
              {({ pressed }) => (
                <Ionicons
                  name="checkmark-circle"
                  size={32}
                  color="#67f59bff"
                  style={pressed && styles.iconGlyphGlow}
                />
              )}
            </Pressable>
          </View>
        </View>
      )}
      ListFooterComponent={<View style={{ height: 100 }} />}
    />

    <View style={styles.bottomBar}>
      <Pressable
        onPress={() => navigation.navigate("Home")}
        hitSlop={10}
        android_ripple={{ borderless: true }}
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
        onPress={() => navigation.navigate("NewFlashcard" as never, { topicId: 0 } as never)}
        hitSlop={10}
        android_ripple={{ borderless: true }}
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
        onPress={() => navigation.navigate("LearnedCards" as never)}
        hitSlop={10}
        android_ripple={{ borderless: true }}
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
);
};

export default WalletScreen;
