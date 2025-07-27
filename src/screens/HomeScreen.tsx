import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/homeStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation, route }: Props) => {
  const { userId, username } = route.params;
  React.useLayoutEffect(() => {
  navigation.setOptions({
    headerBackVisible: false, // removes back arrow
    title: username, // shows username in the header
  });
}, [navigation, username]);

  return (
    <View style={styles.container}>
      {/* Left Sidebar */}
      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.sidebarButton}>
          <Text>PROGRESS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sidebarButton}>
          <Text>QUIZ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sidebarButton}>
          <Text>WALLET</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        <TouchableOpacity onPress={() => navigation.navigate('Topics')}>
          <Text style={styles.learnText}>LEARN</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text>CONSTRUCTOR</Text>
        </TouchableOpacity>
        <View style={styles.sideButtons}>
          <TouchableOpacity style={styles.smallButton}>
            <Text>SETTINGS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })}>
            <Text>EXIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;