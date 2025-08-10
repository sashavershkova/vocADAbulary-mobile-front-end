import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Pressable, ActivityIndicator } from "react-native";
import { useMockUser } from "../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from '../types/navigation';
import { getWalletFlashcards, updateWalletFlashcardStatus, getLearnedFlashcards, hideFlashcardCompletely } from "../api/wallet";
import styles from "../styles/walletStyles";
import { LinearGradient } from "expo-linear-gradient";

type LearnedNavProp = NativeStackNavigationProp<RootStackParamList, "LearnedCards">;

const LearnedFlashcardsScreen = () => {
  const navigation = useNavigation<LearnedNavProp>();
  const { user } = useMockUser();
  const userId = user.id;
  const username = user.username;
  const initials = username?.charAt(0).toUpperCase() || '?';
  const [searchFocused, setSearchFocused] = useState(false);
  const [flashcards, setFlashcards] = useState<WalletFlashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const fetchLearned = async () => {
    try {
      setLoading(true);
      const data = await getLearnedFlashcards(userId);

      const learned = data.map((item: any) => ({
        id: item.flashcardId,
        word: item.word,
        status: item.status,
        lastReviewed: item.lastReviewed,
      }));

      setFlashcards(learned);
    } catch (error) {
      console.error("Error fetching learned:", error);
      Alert.alert("Error", "Could not load learned flashcards.");
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "PIGGY BANK",
      headerStyle: {
        backgroundColor: "#b0f4c9ff",
      },
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
  }, []);

  const moveBackToMainDeck = async (id: number) => {
    try {
      await updateWalletFlashcardStatus(userId, id, "IN_PROGRESS");
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
    <LinearGradient colors={["#b0f4c9ff", "#313bae8c"]} style={styles.container}>
      <View style={[styles.inputBase, searchFocused && styles.inputFocused]}>
        <TextInput
          style={styles.inputField}
          placeholder="Search in learned..."
          value={searchText}
          onChangeText={setSearchText}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </View>

      <FlatList
        data={filteredFlashcards}
        keyExtractor={(item) => String(item.id)}
        style={{ marginBottom: 90 }}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <View style={styles.cardRow}>
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <Text style={styles.termText}>{item.word}</Text>
            </View>

            <View style={styles.iconRow}>
              <View style={styles.returnCircleWrapper}>
                <Pressable
                  onPress={() => moveBackToMainDeck(item.id)}
                  hitSlop={10}
                  style={styles.returnCircleBox}
                >
                  {({ pressed }) => (
                    <>
                      <View style={[styles.returnHalo, pressed && styles.returnHaloOn]} />
                      <View style={[styles.returnCircle, pressed && styles.returnCirclePressed]}>
                        <Ionicons
                          name="return-up-back"
                          size={24}
                          color="#246396"
                          style={pressed && styles.iconGlyphGlow}
                        />
                      </View>
                    </>
                  )}
                </Pressable>
                <Text style={styles.returnLabel}>UNWALLET</Text>
              </View>
            </View>
          </View>
        )
        }
        ListFooterComponent={< View style={{ height: 100 }} />}
      />

      <View style={styles.bottomBar}>
        <Pressable
          onPress={() => navigation.navigate("Home")}
          hitSlop={10}
          style={({ pressed }) => [styles.navItem, pressed && styles.iconButtonActive]}
        >
          <Ionicons name="home" size={35} color="#97d0feff" />
          <Text style={styles.navText}>HOME</Text>
        </Pressable>
      </View>
    </LinearGradient >
  );

};

export default LearnedFlashcardsScreen;