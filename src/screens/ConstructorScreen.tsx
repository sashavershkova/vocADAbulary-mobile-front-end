import FallbackScreen from './FallbackScreen';


import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useMockUser } from '../context/UserContext';
import api from '../api/axiosInstance';
import styles from '../styles/quizStyles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Constructor'>;

type Chunk = {
    type: 'text' | 'blank';
    text?: string;
    blankIndex?: number;
    reveal?: boolean;
    revealedWord?: string;
};

const ConstructorScreen = ({ navigation }: Props) => {
    const { user } = useMockUser();
    const userId = user.id;
    const initials = user.username?.charAt(0).toUpperCase() || '?';

    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [templateId, setTemplateId] = useState<number | null>(null);
    const [inputs, setInputs] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [resultText, setResultText] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'CONSTRUCTOR',
            headerBackVisible: false,
            headerStyle: {
                backgroundColor: '#f7b4c4d6',
        },
        headerTitleStyle: {
            fontFamily: 'ArchitectsDaughter-Regular',
            fontSize: 36,
            color: '#246396',
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

    const fetchSentence = async () => {
        setLoading(true);
        setInputs({});
        setResultText(null);
        setIsCorrect(null);

        try {
            const res = await api.get('/api/sentences/random');
            const { id, chunks } = res.data;
            setTemplateId(id);
            setChunks(chunks);
        } catch (err) {
            console.error('Failed to load sentence:', err);
            Alert.alert('Error', 'Failed to load sentence.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSentence();
    }, []);

    const handleChange = (index: number, value: string) => {
        setInputs((prev) => ({ ...prev, [index]: value }));
    };

    const handleSubmit = async () => {
        if (templateId === null) return;
        try {
            const answers = Object.entries(inputs).map(([blankIndex, typedWord]) => ({
            blankIndex: parseInt(blankIndex),
            typedWord,
            }));

            const res = await api.post('/api/sentences/finalize', {
                templateId,
                answers,
            });

            const { finalText, correct } = res.data;
            setIsCorrect(correct);
            setResultText(finalText);

            setTimeout(() => {
                fetchSentence();
            }, 2000);
        } catch (err) {
            console.error('Failed to submit:', err);
            setIsCorrect(false);
            setResultText(null);
            Alert.alert('Try again', 'Incorrect. Try again!');
        }
    };

    const handleReset = () => {
        setInputs({});
        setIsCorrect(null);
        setResultText(null);
    };

    const getFeedbackStyle = () => {
        if (isCorrect === true) return styles.correctAnswerBox;
        if (isCorrect === false) return styles.wrongAnswerBox;
        return null;
    };

    if (loading || !chunks.length) {
        return (
        <LinearGradient colors={['#f7b4c4d6', '#bf86fcc2']} style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#f7b4c4d6', '#bf86fcc2']} style={styles.container}>
            <ScrollView contentContainerStyle={[styles.answersContainer, getFeedbackStyle()]}>
                <KeyboardAvoidingView behavior="padding">
                    <View style={[styles.questionButton]}>
                        <Text style={[styles.questionText]}>
                            {chunks.map((chunk, i) => {
                                if (chunk.type === 'text') return chunk.text;
                                if (chunk.type === 'blank') {
                                    if (chunk.reveal && chunk.revealedWord) return ` ${chunk.revealedWord} `;
                                    return ` ___ `;
                                }
                            })}
                        </Text>
                    </View>

                    {chunks.map((chunk, index) => {
                        if (chunk.type === 'blank') {
                            return (
                                <TextInput
                                    key={index}
                                    style={[styles.answerBox, { fontSize: 20 }]}
                                    placeholder="Type here"
                                    value={inputs[chunk.blankIndex!] || ''}
                                    onChangeText={(text) => handleChange(chunk.blankIndex!, text)}
                                />
                            );
                        }
                        return null;
                    })}
                </KeyboardAvoidingView>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
                    <Ionicons name="home" size={30} color="#97d0feff" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={handleReset}>
                    <Ionicons name="refresh-circle" size={35} color="#97d0feff" />
                    <Text style={styles.navText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={handleSubmit}>
                    <Ionicons name="checkmark-circle" size={35} color="#97d0feff" />
                    <Text style={styles.navText}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={fetchSentence}>
                    <Ionicons name="arrow-forward-circle" size={35} color="#97d0feff" />
                    <Text style={styles.navText}>Next</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default ConstructorScreen;