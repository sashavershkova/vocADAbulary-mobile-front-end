import React, { use, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { useMockUser } from "../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { getWalletFlashcards, removeFromWallet, updateWalletFlashcardStatus, getLearnedFlashcards } from "../api/wallet";
import styles from "../styles/walletStyles";

type LearnedNavProp = NativeStackNavigationProp<RootStackParamList, "LearnedCards">;

type WalletFlashcard = {
  id: number;
  word: string;
  definition: string;
  status: string;
  lastReviewed: string;
  audioUrl?: string;
};

const LearnedFlashcardsScreen = () => {
  const navigation = useNavigation<LearnedNavProp>();
  const mockUser = useMockUser();
  const userId = mockUser.id;  

  const [flashcards, setFlashcards] = useState<WalletFlashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchLearned = async () => {
    try {
      setLoading(true);
      const data = await getLearnedFlashcards(userId); // same endpoint

      const learned = data.map((item: any) => ({
        id: item.flashcardId,
        word: item.word,
        definition: item.definition,
        status: item.status,
        lastReviewed: item.lastReviewed,
        audioUrl: item.audioUrl,
    }));

      setFlashcards(learned);
    } catch (error) {
      console.error("Error fetching learned:", error);
      Alert.alert("Error", "Could not load learned flashcards.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearned();
  }, []);

  const playAudio = async (url?: string) => {
    if (!url) return;
    const { sound } = await Audio.Sound.createAsync({ uri: url });
    await sound.playAsync();
  };

const handleDelete = (id: number) => {
  Alert.alert(
    "Remove Learned Flashcard",
    "What would you like to do with this flashcard?",
    [
      {
        text: "Mark Unlearned, keep in Deck",
        onPress: async () => {
          try {
            await updateWalletFlashcardStatus(userId, id, "IN_PROGRESS");
            Alert.alert("Updated", "Flashcard moved back to the main deck.");
            fetchLearned();
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not move flashcard.");
          }
        },
      },
      {
        text: "Remove Completely",
        style: "destructive",
        onPress: async () => {
          try {
            await removeFromWallet(userId, id);
            Alert.alert("Removed", "Flashcard removed completely.");
            fetchLearned();
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not remove flashcard.");
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]
  );
};

  const moveBackToMainDeck = async (id: number) => {
    try {
      await updateWalletFlashcardStatus(userId,id, "IN_PROGRESS");
      Alert.alert("Updated", "Moved back to main deck.");
      fetchLearned();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not move flashcard.");
    }
  };

  const filteredFlashcards = flashcards.filter((fc) =>
    fc.word.toUpperCase().includes(searchText.toUpperCase())
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search in learned..."
        value={searchText}
        onChangeText={setSearchText}
      />

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
              <Text numberOfLines={1} style={styles.definition}>{item.definition}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.actionButton}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => moveBackToMainDeck(item.id)}>
                <Text style={styles.actionButton}>Return</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.bottomButton}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LearnedFlashcardsScreen;