import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import styles from '../styles/constructorStyles';
import api from '../api/axiosInstance';
import { useMockUser } from '../context/UserContext';
import { RootStackParamList } from '../types/navigation';

import {
  TemplateResponseWithBlank,
  PrepareSentenceResponse,
  Chunk,
  FinalizeSentenceResponse,
} from '../types/sentences';

import bluestick from '../assets/images/bluestick.png';
import PopoverHint from './PopoverHint';

type Props = NativeStackScreenProps<RootStackParamList, 'Constructor'>;

const ConstructorScreen = ({ navigation }: Props) => {
  const [hintVisible, setHintVisible] = useState(false);
  const stickScale = useRef(new Animated.Value(1)).current;

  const { user } = useMockUser();
  const username = user?.username ?? '';
  const initials = username?.charAt(0)?.toUpperCase() || '?';

  const [loading, setLoading] = useState<boolean>(true);
  const [template, setTemplate] = useState<TemplateResponseWithBlank | null>(null);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [revealedWords, setRevealedWords] = useState<Record<number, string>>({});
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const [perBlankResult, setPerBlankResult] = useState<Record<number, boolean | null>>({});
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'CONSTRUCTOR',
      headerBackVisible: false,
      headerStyle: { backgroundColor: '#f7b4c4d6' },
      headerTitleStyle: {
        fontFamily: 'ArchitectsDaughter',
        fontSize: 30,
        color: '#246396',
      },
      headerLeft: () => (
        <Pressable
          onPress={() => {
            Animated.sequence([
              Animated.timing(stickScale, { toValue: 0.5, duration: 100, useNativeDriver: true }),
              Animated.timing(stickScale, { toValue: 1.0, duration: 100, useNativeDriver: true }),
            ]).start(() => setHintVisible(true));
          }}
          style={{ marginLeft: 16, padding: 2 }}
        >
          <Animated.Image source={bluestick} style={{ width: 30, height: 50, transform: [{ scale: stickScale }] }} />
        </Pressable>
      ),
      headerRight: () => (
        <View style={styles.userWrapper}>
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>
          <Text style={styles.userLabel}>User</Text>
        </View>
      ),
    });
  }, [navigation, initials, stickScale]);

  const loadNewTemplate = async () => {
    setLoading(true);
    setFeedback(null);
    setPerBlankResult({});
    setAnswers({});
    setRevealed({});
    setRevealedWords({});
    setAttempts({});
    setFocusedIdx(null);

    try {
      const tRes = await api.get<TemplateResponseWithBlank>('/api/sentences/templates/random');
      const t = tRes.data;
      setTemplate(t);

      await api.post('/api/sentences/reset', { templateId: t.id });

      const pRes = await api.get<PrepareSentenceResponse>(`/api/sentences/templates/${t.id}/prepare`);
      const p = pRes.data;

      const gotChunks = p?.chunks ?? [];
      setChunks(gotChunks);

      const initAnswers: Record<number, string> = {};
      const initRevealed: Record<number, boolean> = {};
      const initRevealedWords: Record<number, string> = {};
      const initAttempts: Record<number, number> = {};

      gotChunks.forEach((c, i) => {
        if (c.type === 'blank') {
          const idx = typeof c.blankIndex === 'number' ? c.blankIndex : i;
          initRevealed[idx] = !!c.reveal;
          initAttempts[idx] = 0;
          if (c.reveal && c.revealedWord) {
            initRevealedWords[idx] = c.revealedWord;
            initAnswers[idx] = c.revealedWord;
          } else {
            initAnswers[idx] = '';
            if (c.revealedWord) initRevealedWords[idx] = c.revealedWord;
          }
        }
      });

      setAnswers(initAnswers);
      setRevealed(initRevealed);
      setRevealedWords(initRevealedWords);
      setAttempts(initAttempts);
    } catch (err) {
      console.error('Failed to load template:', err);
      Alert.alert('Error', 'Failed to load constructor sentence. Please learn some words first.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewTemplate();
  }, []);

  const handleChange = (idx: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [idx]: text }));
    setPerBlankResult((prev) => ({ ...prev, [idx]: null }));
  };

  const handleReset = async () => {
    const cleared: Record<number, string> = {};
    const clearedAttempts: Record<number, number> = {};
    Object.keys(answers).forEach((k) => {
      const i = Number(k);
      cleared[i] = '';
      clearedAttempts[i] = 0;
    });
    
    setAnswers(cleared);
    setAttempts(clearedAttempts);
    setPerBlankResult({});
    setFeedback(null);
    setFocusedIdx(null);
  };

  const handleSubmit = async () => {
    if (!template) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        templateId: template.id,
        answers: Object.keys(answers).map((k) => ({
          blankIndex: Number(k),
          typedWord: answers[Number(k)] ?? '',
        })),
      };

      const res = await api.post<FinalizeSentenceResponse>('/api/sentences/finalize', payload);
      const data = res.data;

      const updatedResult: Record<number, boolean | null> = {};
      const updRevealed: Record<number, boolean> = { ...revealed };
      const updRevealedWords: Record<number, string> = { ...revealedWords };
      const updAttempts: Record<number, number> = { ...attempts };

      data.perBlank.forEach((pb) => {
        const idx = pb.blankIndex;
        updatedResult[idx] = pb.isCorrect;

        if (!pb.isCorrect && !updRevealed[idx]) {
          updAttempts[idx] = (updAttempts[idx] || 0) + 1;
          if (updAttempts[idx] >= 3) {
            const word = updRevealedWords[idx] || pb.revealedWord;
            if (word) {
              updRevealed[idx] = true;
              updRevealedWords[idx] = word;
              setAnswers((prev) => ({ ...prev, [idx]: word }));
              updAttempts[idx] = 0;
            }
          }
        }

        if (pb.reveal && pb.revealedWord) {
          updRevealed[idx] = true;
          updRevealedWords[idx] = pb.revealedWord;
          setAnswers((prev) => ({ ...prev, [idx]: pb.revealedWord || '' }));
          updAttempts[idx] = 0;
        }
      });

      setPerBlankResult(updatedResult);
      setRevealed(updRevealed);
      setRevealedWords(updRevealedWords);
      setAttempts(updAttempts);

      if (data.allCorrect) {
        setFeedback('success');
        setTimeout(() => {
          setFeedback(null);
          loadNewTemplate();
        }, 500);
      } else {
        setFeedback('error');
        setAnswers((prev) => {
          const next = { ...prev };
          Object.keys(updatedResult).forEach((k) => {
            const idx = Number(k);
            if (updatedResult[idx] === false && !updRevealed[idx]) next[idx] = '';
          });
          return next;
        });
        setTimeout(() => setFeedback(null), 700);
      }
      setFocusedIdx(null);
    } catch (err) {
      console.error('Finalize failed:', err);
      Alert.alert('Error', 'Could not check your answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setFocusedIdx(null);
    loadNewTemplate();
  };

  if (loading) {
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
      <PopoverHint visible={hintVisible} onClose={() => setHintVisible(false)}>
        <Text style={styles.hintText}>
        Welcome to the *CONSTRUCTOR*, ADIE, where your brain gets a workout Sheldon would actually approve of. {"\n\n"}
        Any word you've already mastered can play. Just drop it into the sentence in the right spot—before Penny guesses 'bazinga' is a verb.{"\n\n"} 
        Good Luck!
        </Text>
      </PopoverHint>

      <Pressable style={{ flex: 1 }} onPress={() => setFocusedIdx(null)}>
        <View style={styles.introWrap}>
          <Text style={styles.introLineSmall}>You Are on The Finish Line, Adie:))</Text>
          <Text style={styles.introLineSmall}>Check Your Tech Voice!</Text>
          <Text style={styles.introLineBig}>Fill in The Blanks:</Text>
        </View>

        <View style={styles.contentArea}>
          <View
            style={[
              styles.cardBox,
              feedback === 'success' && { borderColor: '#cbf6b6bd', borderWidth: 2 },
              feedback === 'error' && { borderColor: '#F86A6AFF', borderWidth: 2 },
            ]}
          >
            <View style={styles.templateRow}>
              {chunks && chunks.length > 0 ? (
                chunks.map((chunk, i) => {
                  if (chunk.type === 'text') {
                    return (
                      <Text key={`t-${i}`} style={styles.templateText}>
                        {chunk.value ?? ''}
                      </Text>
                    );
                  }
                  const bIdx = typeof chunk.blankIndex === 'number' ? chunk.blankIndex : i;
                  const isRevealed = !!revealed[bIdx];
                  const result = perBlankResult[bIdx];
                  const value = answers[bIdx] ?? '';

                  return (
                    <TextInput
                      key={`b-${bIdx}`}
                      editable={!isRevealed}
                      value={value}
                      onChangeText={(txt) => handleChange(bIdx, txt)}
                      onFocus={() => setFocusedIdx(bIdx)}
                      onBlur={() => setFocusedIdx(null)}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={[
                        styles.blankInput,
                        focusedIdx === bIdx && styles.blankInputFocused,
                        isRevealed && styles.blankInputDisabled,
                        result === true && styles.blankInputCorrect,
                        result === false && styles.blankInputWrong,
                      ]}
                      placeholder={isRevealed ? (revealedWords[bIdx] || 'Answer not available') : '...'}
                      placeholderTextColor="#246396"
                    />
                  );
                })
              ) : (
                <Text style={styles.templateText}>No content</Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>

      <View style={styles.bottomBar}>
        <Pressable
          style={({ pressed }) => [styles.navIcon, pressed && styles.navIconActive]}
          onPress={() => { setFocusedIdx(null); navigation.navigate('Home'); }}
        >
          <Ionicons name="home" size={35} color="#97d0feff" />
          <Text style={styles.navText}>HOME</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navIcon, pressed && styles.navIconActive]}
          onPress={handleReset}
          disabled={submitting}
        >
          <Ionicons name="refresh-circle" size={35} color="#97d0feff" />
          <Text style={styles.navText}>RESET</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navIcon, pressed && styles.navIconActive]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Ionicons name="checkmark-circle" size={35} color="#97d0feff" />
          <Text style={styles.navText}>SUBMIT</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navIcon, pressed && styles.navIconActive]}
          onPress={handleNext}
          disabled={submitting}
        >
          <Ionicons name="arrow-forward-circle" size={35} color="#97d0feff" />
          <Text style={styles.navText}>NEXT</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default ConstructorScreen;
