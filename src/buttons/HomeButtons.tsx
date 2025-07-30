import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import styles from '../styles/homeStyles'; // ✅ ВАЖНО: добавлен импорт стилей

const HomeButtons = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Левая колонка */}
      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.sidebarButton}>
          <Text>PROGRESS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sidebarButton}>
          <Text>QUIZ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sidebarButton}
          onPress={() => navigation.navigate('Wallet')}
        >
          <Text>WALLET</Text>
        </TouchableOpacity>
      </View>

      {/* Центральная большая кнопка */}
      <View style={styles.main}>
        <TouchableOpacity onPress={() => navigation.navigate('Topics')}>
          <Text style={styles.learnText}>LEARN</Text>
        </TouchableOpacity>
      </View>

      {/* Нижняя секция */}
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text>CONSTRUCTOR</Text>
        </TouchableOpacity>
        <View style={styles.sideButtons}>
          <TouchableOpacity style={styles.smallButton}>
            <Text>SETTINGS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            }
          >
            <Text>EXIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeButtons;