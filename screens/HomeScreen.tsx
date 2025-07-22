import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import styles from '../styles/homeStyles';

const HomeScreen = () => {
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
        <Text style={styles.learnText}>LEARN</Text>
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