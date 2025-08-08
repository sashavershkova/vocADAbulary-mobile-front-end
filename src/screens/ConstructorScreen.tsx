import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import quizStyles from '../styles/quizStyles'; // reuse shared look & feel
import cStyles from '../styles/constructorStyles'; // constructor-only styles
import api from '../api/axiosInstance';
import { useMockUser } from '../context/UserContext';
import { RootStackParamList } from '../types/navigation';

import {
  TemplateResponseWithBlank,
  PrepareSentenceResponse,
  Chunk,
  FinalizeSentenceResponse,
} from '../types/sentences';

type Props = NativeStackScreenProps<RootStackParamList, 'Constructor'>;

const ConstructorScreen = ({ navigation }: Props) => {
  const { user } = useMockUser();
  const username = user?.username ?? '';
  const initials = username?.charAt(0)?.toUpperCase() || '?';

  const [loading, setLoading] = useState<boolean>(true);
  const [template, setTemplate] = useState<TemplateResponseWithBlank | null>(null);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [perBlankResult, setPerBlankResult] = useState<Record<number, boolean | null>>({});
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'CONSTRUCTOR',
      headerBackVisible: false,
      headerStyle: { backgroundColor: '#f7b4c4d6' },
      headerTitleStyle: {
        fontFamily: 'ArchitectsDaughter-Regular',
        fontSize: 36,
        color: '#246396',
      },
      headerRight: () => (
        <View style={quizStyles.userWrapper}>
          <View style={quizStyles.initialsCircle}>
            <Text style={quizStyles.initialsText}>{initials}</Text>
          </View>
          <Text style={quizStyles.userLabel}>User</Text>
        </View>
      ),
    });
  }, [navigation, initials]);

  const loadNewTemplate = async () => {
    setLoading(true);
    setFeedback(null);
    setPerBlankResult({});
    setAnswers({});
    setRevealed({});
    try {
      // 1) random template from backend
      const tRes = await api.get<TemplateResponseWithBlank>('/api/sentences/templates/random');
      const t = tRes.data;
      setTemplate(t);

      // 2) prepare chunks (server might set reveal flags)
      const pRes = await api.get<PrepareSentenceResponse>(`/api/sentences/templates/${t.id}/prepare`);
      const p = pRes.data;

      const gotChunks = p?.chunks ?? [];
      setChunks(gotChunks);

      // init answers & reveal map
      const initAnswers: Record<number, string> = {};
      const initRevealed: Record<number, boolean> = {};
      gotChunks.forEach((c) => {
        if (c.type === 'blank' && typeof c.blankIndex === 'number') {
          initRevealed[c.blankIndex] = !!c.reveal;
          initAnswers[c.blankIndex] = c.reveal && c.revealedWord ? c.revealedWord : '';
        }
      });
      setAnswers(initAnswers);
      setRevealed(initRevealed);
    } catch (err) {
      console.error('Failed to load template:', err);
      Alert.alert('Error', 'Failed to load constructor sentence.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewTemplate();
  }, []);

  const handleChange = (idx: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [idx]: text }));
    setPerBlankResult((prev) => ({ ...prev, [idx]: null })); // clear red/green while editing
  };

  const handleReset = () => {
    // Clear user input for this template; keep revealed values
    const cleared: Record<number, string> = {};
    Object.keys(answers).forEach((k) => {
      const i = Number(k);
      cleared[i] = revealed[i] ? (answers[i] || '') : '';
    });
    setAnswers(cleared);
    setPerBlankResult({});
    setFeedback(null);
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

      // build maps
      const updatedResult: Record<number, boolean | null> = {};
      const updRevealed: Record<number, boolean> = { ...revealed };

      data.perBlank.forEach((pb) => {
        updatedResult[pb.blankIndex] = pb.isCorrect;
        if (pb.reveal) {
          updRevealed[pb.blankIndex] = true;
          if (pb.revealedWord) {
            // lock revealed word
            setAnswers((prev) => ({ ...prev, [pb.blankIndex]: pb.revealedWord || '' }));
          }
        }
      });

      setPerBlankResult(updatedResult);
      setRevealed(updRevealed);

      if (data.allCorrect) {
        setFeedback('success');
        setTimeout(() => {
          setFeedback(null);
          loadNewTemplate();
        }, 500);
      } else {
        setFeedback('error');

        // clear only wrong & not revealed inputs so user can retry
        setAnswers((prev) => {
          const next = { ...prev };
          Object.keys(updatedResult).forEach((k) => {
            const idx = Number(k);
            if (updatedResult[idx] === false && !updRevealed[idx]) {
              next[idx] = '';
            }
          });
          return next;
        });

        // brief flash then remove
        setTimeout(() => setFeedback(null), 700);
      }
    } catch (err) {
      console.error('Finalize failed:', err);
      Alert.alert('Error', 'Could not check your answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
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
    <LinearGradient colors={['#f7b4c4d6', '#bf86fcc2']} style={quizStyles.container}>
      {/* Centered content area */}
      <View style={cStyles.contentCenter}>
        <View
          style={[
            quizStyles.questionButton,             // reuse your yellow rounded box
            feedback === 'success' && cStyles.successFlash,
            feedback === 'error' && cStyles.errorFlash,
          ]}
        >
          <View style={cStyles.templateRow}>
            {chunks && chunks.length > 0 ? (
              chunks.map((chunk, i) => {
                if (chunk.type === 'text') {
                  return (
                    <Text key={`t-${i}`} style={cStyles.templateText}>
                      {chunk.value ?? ''}
                    </Text>
                  );
                }
                // blank
                const bIdx = chunk.blankIndex ?? i; // stable key fallback
                const isRevealed = !!revealed[bIdx];
                const result = perBlankResult[bIdx]; // true | false | null
                const value = answers[bIdx] ?? '';

                return (
                  <TextInput
                    key={`b-${bIdx}`}
                    editable={!isRevealed}
                    value={value}
                    onChangeText={(txt) => handleChange(bIdx, txt)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={[
                      cStyles.blankInput,
                      isRevealed && cStyles.blankInputDisabled,
                      result === true && cStyles.blankInputCorrect,
                      result === false && cStyles.blankInputWrong,
                    ]}
                    placeholder={isRevealed ? 'revealed' : '...'}
                    placeholderTextColor="#246396"
                  />
                );
              })
            ) : (
              <Text style={cStyles.templateText}>No content</Text>
            )}
          </View>
        </View>
      </View>

      {/* Bottom nav reused from quiz */}
      <View style={quizStyles.bottomBar}>
        <TouchableOpacity style={quizStyles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={30} color="#97d0feff" />
          <Text style={quizStyles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={quizStyles.navItem} onPress={handleReset} disabled={submitting}>
          <Ionicons name="refresh-circle" size={35} color="#97d0feff" />
          <Text style={quizStyles.navText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity style={quizStyles.navItem} onPress={handleSubmit} disabled={submitting}>
          <Ionicons name="checkmark-circle" size={35} color="#97d0feff" />
          <Text style={quizStyles.navText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={quizStyles.navItem} onPress={handleNext} disabled={submitting}>
          <Ionicons name="arrow-forward-circle" size={35} color="#97d0feff" />
          <Text style={quizStyles.navText}>Next</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ConstructorScreen;
