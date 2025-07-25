import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/homeStyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
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
          <TouchableOpacity style={styles.smallButton}>
            <Text>EXIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;