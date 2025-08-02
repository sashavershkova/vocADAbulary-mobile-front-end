import React, { useEffect, useState, useLayoutEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
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
  const { user } = useMockUser();
  const userId = user.id;
  const username = user.username;
  const initials = username?.charAt(0).toUpperCase() || "?";

  const [flashcards, setFlashcards] = useState<WalletFlashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchWallet = async () => {
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
      fontFamily: "ArchitectsDaughter-Regular", 
      fontSize: 24,
    },
    headerRight: () => (
      <View style={styles.initialsCircle}>
        <Text style={styles.initialsText}>{initials}</Text>
      </View>
    ),
  });
}, [navigation, initials]);

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
      <TextInput
        style={styles.searchBar}
        placeholder="Search in wallet..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredFlashcards}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <View style={styles.cardRow}>
            {/* Левая часть: звук + слово */}
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <TouchableOpacity onPress={() => playAudio(item.audioUrl)} style={{ marginRight: 8 }}>
                <Ionicons name="volume-high-outline" size={32} color="#127712ff" />
              </TouchableOpacity>

              <Text style={styles.termText}>{item.word}</Text>
            </View>

            {/* Правая часть: удалить + изучено */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="remove-circle" size={32} color="#f94949ac" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => markAsLearned(item.id)}>
                <Ionicons name="checkmark-circle" size={32} color="#227345ff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={30} color="#246396" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("NewFlashcard" as never, { topicId: 0 } as never)
          }
        >
          <Ionicons name="add-circle" size={38} color="#246396" />
        </TouchableOpacity>

        <TouchableOpacity disabled>
          <Ionicons name="wallet" size={30} color="#246396" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default WalletScreen;
