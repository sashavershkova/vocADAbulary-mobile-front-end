import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useMockUser } from "../context/UserContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


const TopicsButtons = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useMockUser();
  const userId = user.id;

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() =>
          navigation.navigate('Home', {
            userId: userId,
            username: user.username,
          })
        }
      >
        <Ionicons name="home" size={28} color='#2c6f33' />
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          console.log('Add button pressed');
          navigation.navigate('NewFlashcard', { topicId: topic.id }); 
        }}
      >
        <Ionicons name="add" size={36} color='#8c64b6b1' />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: '#d9bcf7ff',

  },
  homeButton: {
    alignItems: 'center',
  },
  addButton: {
    width: 56,
    height: 56,
    backgroundColor: "#9edd81ff",
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#006400',
    marginTop: 4,
    fontFamily: 'ArchitectsDaughter',
    fontSize: 14,
  },
});

export default TopicsButtons;
