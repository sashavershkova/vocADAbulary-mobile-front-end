import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styles from '../styles/topicsStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Topics'>;

type Topic = {
  id: number;
  name: string;
};

const TopicsScreen = ({ navigation }: Props) => {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/topics')  // adjust if needed
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(err => console.error(err));
  }, []);

  const renderTopic = ({ item }: { item: Topic }) => (
    <TouchableOpacity
      style={styles.topicBox}
      onPress={() =>
        navigation.navigate('Topic', {
          topicId: item.id,
          topicName: item.name,
        })
      }
    >
      <Text style={styles.topicText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTopic}
        contentContainerStyle={styles.topicList}
      />
    </View>
  );
};

export default TopicsScreen;