import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import quizStyles from '../styles/quizStyles';
import cStyles from '../styles/constructorStyles';
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
  const [revealedWords, setRevealedWords] = useState<Record<number, string>>({});
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const [perBlankResult, setPerBlankResult] = useState<Record<number, boolean | null>>({});
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [resetCount, setResetCount] = useState<number>(0);
  const [, forceUpdate] = useState<{}>({});

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
    setRevealedWords({});
    setAttempts({});

    try {
      const tRes = await api.get<TemplateResponseWithBlank>('/api/sentences/templates/random');
      const t = tRes.data;
      setTemplate(t);

      // Reset session stats for the new template (fresh start)
      await api.post('/api/sentences/reset', { templateId: t.id });

      const pRes = await api.get<PrepareSentenceResponse>(`/api/sentences/templates/${t.id}/prepare`);
      const p = pRes.data;

      console.log('loadNewTemplate: prepare response', p);

      const gotChunks = p?.chunks ?? [];
      setChunks(gotChunks);

      const initAnswers: Record<number, string> = {};
      const initRevealed: Record<number, boolean> = {};
      const initRevealedWords: Record<number, string> = {};
      const initAttempts: Record<number, number> = {};
      
      gotChunks.forEach((c) => {
        if (c.type === 'blank' && typeof c.blankIndex === 'number') {
          initRevealed[c.blankIndex] = !!c.reveal;
          initAttempts[c.blankIndex] = 0;
          if (c.reveal && c.revealedWord) {
            initRevealedWords[c.blankIndex] = c.revealedWord;
            initAnswers[c.blankIndex] = c.revealedWord;
          } else {
            initAnswers[c.blankIndex] = '';
            if (c.revealedWord) {
              initRevealedWords[c.blankIndex] = c.revealedWord;
            }
          }
        }
      });
      
      setAnswers(initAnswers);
      setRevealed(initRevealed);
      setRevealedWords(initRevealedWords);
      setAttempts(initAttempts);

      console.log('loadNewTemplate: fresh template loaded');
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
    // Clear frontend state
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
    setResetCount((prev) => prev + 1);
    setRevealed({});
    setRevealedWords({});

    console.log('handleReset: clearedAnswers', cleared);
    console.log('handleReset: clearedAttempts', clearedAttempts);

    // Reset backend session state (not persistent stats)
    if (template) {
      try {
        await api.post('/api/sentences/reset', { templateId: template.id });
        console.log('Backend session stats reset successfully');
        
        // Reload template to get fresh reveal status
        const pRes = await api.get<PrepareSentenceResponse>(`/api/sentences/templates/${template.id}/prepare`);
        const p = pRes.data;
        
        const gotChunks = p?.chunks ?? [];
        setChunks(gotChunks);

        // Reinitialize state based on fresh backend response
        const initAnswers: Record<number, string> = {};
        const initRevealed: Record<number, boolean> = {};
        const initRevealedWords: Record<number, string> = {};
        const initAttempts: Record<number, number> = {};
        
        gotChunks.forEach((c) => {
          if (c.type === 'blank' && typeof c.blankIndex === 'number') {
            initRevealed[c.blankIndex] = !!c.reveal;
            initAttempts[c.blankIndex] = 0;
            if (c.reveal && c.revealedWord) {
              initRevealedWords[c.blankIndex] = c.revealedWord;
              initAnswers[c.blankIndex] = c.revealedWord;
            } else {
              initAnswers[c.blankIndex] = '';
              if (c.revealedWord) {
                initRevealedWords[c.blankIndex] = c.revealedWord;
              }
            }
          }
        });
        
        setAnswers(initAnswers);
        setRevealed(initRevealed);
        setRevealedWords(initRevealedWords);
        setAttempts(initAttempts);
        
        console.log('Reset: fresh state loaded from backend');
      } catch (err) {
        console.error('Failed to reset backend session stats:', err);
        Alert.alert('Error', 'Failed to reset session. Please try again.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!template) return;
    setSubmitting(true);
    setFeedback(null);

    console.log('handleSubmit: current attempts', attempts);
    console.log('handleSubmit: current answers', answers);
    console.log('handleSubmit: current revealed', revealed);
    console.log('handleSubmit: current revealedWords', revealedWords);

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

      console.log('handleSubmit: finalize response data', data);
      console.log('handleSubmit: perBlank from server', data.perBlank);

      const updatedResult: Record<number, boolean | null> = {};
      const updRevealed: Record<number, boolean> = { ...revealed };
      const updRevealedWords: Record<number, string> = { ...revealedWords };
      const updAttempts: Record<number, number> = { ...attempts };

      data.perBlank.forEach((pb) => {
        const idx = pb.blankIndex;
        updatedResult[idx] = pb.isCorrect;

        console.log(`handleSubmit: processing blank ${idx}, isCorrect: ${pb.isCorrect}, server reveal: ${pb.reveal}, server revealedWord: ${pb.revealedWord}`);

        if (!pb.isCorrect && !updRevealed[idx]) {
          updAttempts[idx] = (updAttempts[idx] || 0) + 1;
          console.log(`handleSubmit: incremented attempts for ${idx} to ${updAttempts[idx]}`);

          if (updAttempts[idx] >= 3) {
            const word = updRevealedWords[idx] || pb.revealedWord;
            if (word) {
              updRevealed[idx] = true;
              updRevealedWords[idx] = word;
              setAnswers((prev) => ({ ...prev, [idx]: word }));
              updAttempts[idx] = 0;
              console.log(`handleSubmit: reveal triggered for ${idx}, setting answer to ${word}`);
            } else {
              console.log(`handleSubmit: reveal NOT triggered for ${idx}, attempts: ${updAttempts[idx]}, no revealedWord available`);
              Alert.alert('Error', `Correct word for blank ${idx} not available from server.`);
            }
          } else {
            console.log(`handleSubmit: reveal NOT triggered for ${idx}, attempts: ${updAttempts[idx]}, has revealedWord: ${!!updRevealedWords[idx]}`);
          }
        }

        if (pb.reveal && pb.revealedWord) {
          updRevealed[idx] = true;
          updRevealedWords[idx] = pb.revealedWord;
          setAnswers((prev) => ({ ...prev, [idx]: pb.revealedWord || '' }));
          updAttempts[idx] = 0;
          console.log(`handleSubmit: server reveal for ${idx}, setting answer to ${pb.revealedWord}`);
        } else if (pb.reveal && !pb.revealedWord) {
          console.log(`handleSubmit: server reveal for ${idx}, but revealedWord is null`);
          Alert.alert('Error', `Server indicated reveal for blank ${idx} but provided no word.`);
        }
      });

      setPerBlankResult(updatedResult);
      setRevealed(updRevealed);
      setRevealedWords(updRevealedWords);
      setAttempts(updAttempts);

      console.log('handleSubmit: updated revealed', updRevealed);
      console.log('handleSubmit: updated revealedWords', updRevealedWords);
      console.log('handleSubmit: updated attempts', updAttempts);
      console.log('handleSubmit: updated perBlankResult', updatedResult);

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
            if (updatedResult[idx] === false && !updRevealed[idx]) {
              next[idx] = '';
            }
          });
          return next;
        });
        setTimeout(() => setFeedback(null), 700);

        console.log('handleSubmit: answers after clearing wrong ones', answers);
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
      <View style={cStyles.contentCenter}>
        <View
          style={[
            quizStyles.questionButton,
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
                const bIdx = chunk.blankIndex ?? i;
                const isRevealed = !!revealed[bIdx];
                const result = perBlankResult[bIdx];
                const value = answers[bIdx] ?? '';

                console.log(`Render blank ${bIdx}: isRevealed ${isRevealed}, value '${value}', placeholder '${isRevealed ? revealedWords[bIdx] || '...' : '...'}', result ${result}`);

                return (
                  <TextInput
                    key={`b-${bIdx}-${resetCount}`}
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
                    placeholder={isRevealed ? (revealedWords[bIdx] || 'Answer not available') : '...'}
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