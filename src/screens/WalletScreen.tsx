import React, { useEffect, useState, useLayoutEffect } from "react";
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
import { ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer'; 

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
    fetchWallet();
  }, []);

  const playAudio = async (flashcardId: number) => {
    try {
      const response = await api.get(`/api/flashcards/${flashcardId}/tts`, {
        responseType: 'arraybuffer',
      });

      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      const fileUri = FileSystem.cacheDirectory + `temp-audio-${flashcardId}.mp3`;

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true }
      );

      // await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });

      await sound.playAsync();
    } catch (err) {
      console.error(`Playback error for flashcard ${flashcardId}:`, err);
      Alert.alert('Error', 'Could not generate audio.');
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
                <Ionicons name="play-circle" size={32} color="#97d0feff" />
              </TouchableOpacity>

              <Text style={styles.termText}>{item.word}</Text>
            </View>

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
      
      ListFooterComponent={<View style={{ height: 100 }} />} 
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={35} color="#97d0feff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("NewFlashcard" as never, { topicId: 0 } as never)}
        >
          <Ionicons name="add-circle" size={35} color="#97d0feff" />
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("LearnedCards" as never)}
        >
          <FontAwesome5 name="piggy-bank" size={35} color="#97d0feff" />
          <Text style={styles.navText}>Piggy Bank</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default WalletScreen;
