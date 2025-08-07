import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const PopoverHint = ({ visible, onClose, children }: Props) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.popover}>
          <Text style={styles.text}>{children}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={26} color="#767776ff" />
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
    backgroundColor: 'rgba(9, 9, 9, 0.1)',
  },
  popover: {
    backgroundColor: '#fae6ffff', 
    padding: 16,
    borderRadius: 12,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  text: {
    fontSize: 16,
    fontFamily: 'ArchitectsDaughter-Regular',
    color: '#767776ff',
    textAlign: 'left',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
});

export default PopoverHint;
