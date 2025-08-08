import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import api from "../api/axiosInstance";
import { useMockUser } from "../context/UserContext";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";
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
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import {
  ensureCacheDirExists,
  getCachedAudioPath,
  isAudioCached,
  fetchAndCacheTTS,
  playTTS,
} from "../utils/ttsUtils";
import greenstick from '../assets/images/greenstick.png';
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
  const isGreen = false;
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
      headerBackVisible: false,
      headerStyle: {
        backgroundColor: "#b0f4c9ff",
      },
      headerTitleStyle: {
        color: "#246396",
        fontFamily: "ArchitectsDaughter",
        fontSize: 36,
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => setHintVisible(true)} style={{ marginLeft: 10 }}>
          <Image
            source={isGreen ? greenstick : bluestick}
            style={{ width: 30, height: 50, marginLeft: 15 }}
          />
        </TouchableOpacity>
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
          Welcome to your **WALLET** — where your favorite flashcards live happily ever after (until you delete them, you monster).{"\n\n"}

          These are your personal MVPs, handpicked from the Learn section.{"\n"}
          You can replay them endlessly, because repetition is key — just ask Sheldon, who's watched Star Trek 193 times.{"\n\n"}

          But wait, there's more:{"\n"}
          - Want to create your own nerdy masterpiece? Go for it — unleash your inner Amy Farrah Fowler, ADD a new card.{"\n"}
          - Need to track what you've mastered? Slide over to the PIGGY BANK — it's like your brain's trophy shelf.{"\n\n"}

          TL;DR: This is your Word Fortress. Customize it, listen to it, and flaunt it like Howard flaunts his belt buckles.{"\n\n"}

          Fun fact: Unlike Raj, you can totally speak here — just press play.
        </Text>
      </PopoverHint>
      <TextInput
        style={styles.searchBar}
        placeholder="Search in wallet..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredFlashcards}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginBottom: 90 }}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <View style={styles.cardRow}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <TouchableOpacity onPress={() => playAudio(item.id)} style={{ marginRight: 8 }}>
                {ttsLoadingId === item.id ? (
                  <ActivityIndicator size="small" color="#97d0feff" />
                ) : (
                  <Ionicons name="play-circle" size={32} color="#97d0feff" />
                )}
              </TouchableOpacity>

              <Text style={styles.termText}>{item.word}</Text>
            </View>

            <View style={styles.iconRow}>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="remove-circle" size={32} color="#f94949ac" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => markAsLearned(item.id)}>
                <Ionicons name="checkmark-circle" size={32} color="#006400" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={35} color="#97d0feff" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("NewFlashcard" as never, { topicId: 0 } as never)}
        >
          <Ionicons name="add-circle" size={35} color="#97d0feff" />
          <Text style={styles.navText}>ADD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("LearnedCards" as never)}
        >
          <FontAwesome5 name="piggy-bank" size={35} color="#97d0feff" />
          <Text style={styles.navText}>PIGGY BANK</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default WalletScreen;
