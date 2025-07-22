// screens/TopicsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from '../styles/topicsStyles';
import axios from 'axios';

interface Topic {
  id: number;
  name: string;
}

const TopicsScreen = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:8080/topics') 
      .then(response => {
        setTopics(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching topics:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  const renderTopic = ({ item }: { item: Topic }) => (
    <TouchableOpacity style={styles.topicBox}>
      <Text style={styles.topicText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        renderItem={renderTopic}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        numColumns={2}
      />
    </View>
  );
};

export default TopicsScreen;