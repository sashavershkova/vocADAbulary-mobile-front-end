import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
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

  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "NEW FLASHCARD",
      headerBackVisible: false,
      headerStyle: {
        backgroundColor: "#b0f4c9ff",
      },
      headerTitleStyle: {
        fontFamily: "ArchitectsDaughter-Regular",
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

  // Fetch topics
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

  // Save flashcard
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
      navigation.navigate("Home", { userId, username });
    } catch (error) {
      console.error('Error saving flashcard:', error);
      Alert.alert('Error', 'Could not save flashcard.');
    }
  };

  return (
  <LinearGradient colors={["#b0f4c9ff", "#313bae8c"]} style={styles.container}>
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      {/* SELECT TOPIC */}
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
            <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
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

      {/* WORD */}
      <Text style={styles.label}>Add New Word</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter word"
        placeholderTextColor="#aaa"
        value={word}
        onChangeText={setWord}
      />

      {/* DEFINITION */}
      <Text style={styles.label}>Add Definition</Text>
      <TextInput
        style={styles.longInput}
        placeholder="Enter definition"
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={4}
        value={definition}
        onChangeText={setDefinition}
      />

      {/* EXAMPLE */}
      <Text style={styles.label}>Add Example</Text>
      <TextInput
        style={styles.longInput}
        placeholder="Enter example"
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={4}
        value={example}
        onChangeText={setExample}
      />
    </ScrollView>

    {/* BOTTOM BAR */}
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home" size={35} color="#97d0feff" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSave} style={styles.navItem}>
        <Ionicons name="checkmark-circle" size={35} color="#97d0feff" />
        <Text style={styles.navText}>Submit</Text>
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

};

export default NewFlashcardScreen;