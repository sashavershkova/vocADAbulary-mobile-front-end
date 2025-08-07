import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  visible: boolean;
  onClose: () => void;
  text: string;
};

const PopoverHint = ({ visible, onClose, text }: Props) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.popover}>
          <Text style={styles.text}>{text}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={24} color="#2c6f33" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  popover: {
    backgroundColor: '#fffbe6',
    padding: 16,
    borderRadius: 12,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    position: 'relative',
  },
  text: {
    fontSize: 16,
    fontFamily: 'ArchitectsDaughter-Regular',
    color: '#2c6f33',
  },
  closeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
});

export default PopoverHint;
