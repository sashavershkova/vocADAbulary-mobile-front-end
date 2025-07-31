import React, { useState } from 'react';
import { useMockUser } from "../context/UserContext";
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import api from '../api/axiosInstance';
import styles from '../styles/formStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'NewFlashcard'>;

const NewFlashcardScreen = ({ navigation, route }: Props) => {
    const { topicId } = route.params as { topicId: string }; // topicId passed from navigation
    const { user } = useMockUser();
    const userId = user.id;
    const [word, setWord] = useState('');
    const [definition, setDefinition] = useState('');
    const [example, setExample] = useState('');

    const handleSave = async () => {
        if (!word || !definition || !example) {
        Alert.alert('Missing fields', 'Please fill out all fields.');
        return;
        }

        try {
        const response = await api.post(`/api/topics/${topicId}/flashcards`, {
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
            style={styles.homeButton}
            onPress={() =>
            navigation.navigate('Home', {
                userId: userId,
                username: user.username,
            })
            }
        >
            <Ionicons name="home" size={28} color='#006400' />
            <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>

            <TouchableOpacity
            style={[styles.button, { backgroundColor: '#228B22' }]}
            onPress={handleSave}
            >
            <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

export default NewFlashcardScreen;