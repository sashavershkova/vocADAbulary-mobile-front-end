import React, { useState, useEffect } from 'react';
import { useMockUser } from "../context/UserContext";
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/axiosInstance';
import styles from '../styles/newflashcardStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'NewFlashcard'>;

type Topic = {
    id: number;
    name: string;
};

const NewFlashcardScreen = ({ navigation, route }: Props) => {
    // const { topicId } = route.params as { topicId: string }; // topicId passed from navigation
    const { user } = useMockUser();
    const userId = user.id;
    const [word, setWord] = useState('');
    const [definition, setDefinition] = useState('');
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [example, setExample] = useState('');

    // Load topics from backend
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await api.get('/api/topics');
                setTopics(response.data)
                console.log("Fetching topics...");
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
                example
            });
            Alert.alert('Success', 'Flashcard saved!');
            navigation.navigate({ name: 'Home', params: { userId, username: user.username } }); // navigate back to home after saving
        } catch (error) {
            console.error('Error saving flashcard:', error);
            Alert.alert('Error', 'Could not save flashcard.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Topic</Text>
            <Dropdown
                data={topics.map(topic => ({ label: topic.name, value: topic.id }))}
                labelField="label"
                valueField="value"
                placeholder="Select a topic"
                value={selectedTopicId}
                onChange={item => setSelectedTopicId(item.value)}
                style={styles.dropdown}
            // style={{ marginBottom: 20, borderWidth: 1, borderColor: 'gray', padding: 8, borderRadius: 5 }}
            />

            <Text style={styles.label}>Word</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter word"
                value={word}
                onChangeText={setWord}
            />

            <Text style={styles.label}>Definition</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter definition"
                value={definition}
                onChangeText={setDefinition}
                multiline
            />

            <Text style={styles.label}>Example</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter example"
                value={example}
                onChangeText={setExample}
                multiline
            />

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Ionicons name="home" size={30} color="#97d0feff" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSave} style={styles.navItem}>
                    <Ionicons name="checkmark-circle" size={30} color="#a8f8b0ff" />
                    <Text style={styles.navText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default NewFlashcardScreen;