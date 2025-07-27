import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from '../../App';
import { getWalletFlashcards, removeFromWallet, updateWalletFlashcardStatus } from "../api/wallet";
import styles from "../styles/walletStyles"; // Import your styles


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
  const navigation = useNavigation<WalletNavProp>();
  const [flashcards, setFlashcards] = useState<WalletFlashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

const fetchWallet = async () => {
  try {
    setLoading(true);
    const data = await getWalletFlashcards();
    console.log("Wallet data:", JSON.stringify(data, null, 2));

    // Map backend data (flashcardId) to the format expected by the frontend
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

  useEffect(() => {
    fetchWallet();
  }, []);

  const playAudio = async (url?: string) => {
    if (!url) return;
    const { sound } = await Audio.Sound.createAsync({ uri: url });
    await sound.playAsync();
  };

  const handleDelete = async (id: number) => {
    try {
      await removeFromWallet(id);
      Alert.alert("Removed", "Flashcard removed from wallet.");
      fetchWallet();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not remove flashcard.");
    }
  };

  const markAsLearned = async (id: number) => {
    try {
      await updateWalletFlashcardStatus(id, "LEARNED");
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
    <View style={styles.container}>
      {/* Search bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search in wallet..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Flashcards list */}
      <FlatList
        data={filteredFlashcards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardRow}>
            <TouchableOpacity onPress={() => playAudio(item.audioUrl)}>
              <Ionicons name="volume-high-outline" size={24} />
            </TouchableOpacity>

            <View style={styles.cardContent}>
              <Text style={styles.word}>{item.word}</Text>
              <Text numberOfLines={1} style={styles.definition}>
                {item.definition}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.actionButton}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => markAsLearned(item.id)}>
                <Text style={styles.actionButton}>Learned</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Bottom buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.bottomButton}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("LearnedCards" as never)}>
          <Text style={styles.bottomButton}>Learned Cards</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WalletScreen;