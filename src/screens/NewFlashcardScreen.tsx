import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/newflashcardStyles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useMockUser } from "../context/UserContext";
import api from "../api/axiosInstance";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "NewFlashcard">;

type Topic = {
  id: number;
  name: string;
};

const NewFlashcardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useMockUser();
  const userId = user.id;
  const username = user.username;
  const initials = username?.charAt(0).toUpperCase() || "?";
  const [wordFocused, setWordFocused] = useState(false);
  const [defFocused, setDefFocused] = useState(false);
  const [exFocused, setExFocused] = useState(false);

  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "NEW FLASHCARD",
      headerBackVisible: false,
      headerStyle: {
        backgroundColor: "#b0f4c9ff",
      },
      headerTitleStyle: {
        fontFamily: "ArchitectsDaughter",
        fontSize: 32,
        color: "#246396",
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
  }, [navigation]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get('/api/topics');
        setTopics(response.data);
        console.log("Topics response:", response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
        Alert.alert('Error', 'Could not load topics.');
      }
    };
    fetchTopics();
  }, []);

  const handleSave = async () => {
    if (!word || !definition || !example || !selectedTopicId) {
      Alert.alert('Missing fields', 'Please fill out all fields.');
      return;
    }

    try {
      const response = await api.post(`/api/topics/${selectedTopicId}/flashcards`, {
        word,
        definition,
        example,
      });
      Alert.alert('Success', 'Flashcard saved!');
      navigation.navigate("Wallet");
    } catch (error) {
      console.error('Error saving flashcard:', error);
      Alert.alert('Error', 'Could not save flashcard.');
    }
  };

  return (
    <LinearGradient colors={["#b0f4c9ff", "#313bae8c"]} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.label}>Select the Topic</Text>

        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setDropdownOpen(!dropdownOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownHeaderText}>
              {selectedTopicId
                ? topics.find((t) => t.id === selectedTopicId)?.name
                : "Select a topic"}
            </Text>
            <Text style={styles.dropdownArrow}>{dropdownOpen ? "▴" : "▾"}</Text>
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownOverlay}>
              <ScrollView style={styles.dropdownList} nestedScrollEnabled>
                {topics.map((topic) => (
                  <TouchableOpacity
                    key={topic.id}
                    onPress={() => {
                      setSelectedTopicId(topic.id);
                      setDropdownOpen(false);
                    }}
                    style={[
                      styles.dropdownItem,
                      selectedTopicId === topic.id && styles.dropdownItemSelected,
                    ]}
                  >
                    <Text style={styles.dropdownItemText}>{topic.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <Text style={styles.label}>Add New Word</Text>
        <View style={[styles.inputBase, wordFocused && styles.inputFocused]}>
          <TextInput
            style={styles.inputField}
            placeholder="Enter word"
            placeholderTextColor="#7b7a7aff"
            value={word}
            onChangeText={setWord}
            onFocus={() => setWordFocused(true)}
            onBlur={() => setWordFocused(false)}
          />
        </View>

        <Text style={styles.label}>Add Definition</Text>
        <View style={[styles.inputBase, defFocused && styles.inputFocused, { minHeight: 150 }]}>
          <TextInput
            style={[styles.inputField, { minHeight: 150 }]}
            placeholder="Enter definition"
            placeholderTextColor="#7b7a7aff"
            multiline
            value={definition}
            onChangeText={setDefinition}
            onFocus={() => setDefFocused(true)}
            onBlur={() => setDefFocused(false)}
          />
        </View>

        <Text style={styles.label}>Add Example</Text>
        <View style={[styles.inputBase, exFocused && styles.inputFocused, { minHeight: 150 }]}>
          <TextInput
            style={[styles.inputField, { minHeight: 150 }]}
            placeholder="Enter example"
            placeholderTextColor="#7b7a7aff"
            multiline
            value={example}
            onChangeText={setExample}
            onFocus={() => setExFocused(true)}
            onBlur={() => setExFocused(false)}
          />
        </View>
      </ScrollView>

    <View style={styles.bottomBar}>
        <Pressable
          onPress={() => navigation.navigate("Home")}
          hitSlop={10}
          style={({ pressed }) => [styles.navItem]}
        >
          {({ pressed }) => (
            <>
              <Ionicons
                name="home"
                size={35}
                color="#97d0feff"
                style={pressed && styles.iconGlyphGlow}
              />
              <Text style={styles.navText}>HOME</Text>
            </>
          )}
        </Pressable>

        <Pressable
          onPress={handleSave}
          hitSlop={10}
          style={({ pressed }) => [styles.navItem]}
        >
          {({ pressed }) => (
            <>
              <Ionicons
                name="checkmark-circle"
                size={35}
                color="#97d0feff"
                style={pressed && styles.iconGlyphGlow}
              />
              <Text style={styles.navText}>SUBMIT</Text>
            </>
          )}
        </Pressable>
      </View>
    </LinearGradient>
  );



};

export default NewFlashcardScreen;