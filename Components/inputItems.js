import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function inputItems({ onAddTask }) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onAddTask(input.trim());
      setInput('');
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Set a task"
        value={input}
        onChangeText={setInput}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    height: 50
  },
  addButton: {
    backgroundColor: '#000',
    marginLeft: 10,
    padding: 10,
    borderRadius: 50
  }
});