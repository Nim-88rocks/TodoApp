import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Item({ task, onComplete, onUpdate }) {
  return (
    <View style={styles.taskContainer}>
      <Text style={styles.taskText}>{task.text}</Text>
      <View style={styles.actionsContainer}>
        {/* Update Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => onUpdate(task.id)}
        >
          <Ionicons name="create-outline" size={24} color="#3b82f6" />
        </TouchableOpacity>
        {/* Checkbox */}
        <TouchableOpacity onPress={() => onComplete(task.id)}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  taskText: {
    fontSize: 16,
    flex: 1, // Take up remaining space
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10, // Add spacing between the button and the checkbox
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});