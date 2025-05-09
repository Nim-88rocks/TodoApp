import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Item({ task, onComplete, onUpdate ,onDone}) {
  return (
    <View style={styles.taskContainer}>
      <Text style={styles.taskText}>{task.text}</Text>
      <View style={styles.actionsContainer}>
        {/* Done Button */}
        <TouchableOpacity onPress={onDone}>
          <Ionicons
            name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={task.completed ? 'black' : 'gray'}
          />
        </TouchableOpacity>
        {/* Update Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => onUpdate(task.id)}
        >
          <Ionicons name="create-outline" size={24} color="#000" />
        </TouchableOpacity>

        {/* delete Button */}
       <TouchableOpacity onPress={() => onComplete(task.id)}>
  <Ionicons name="trash-outline" size={24} color="black" />
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
    backgroundColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10, // Add spacing between the button and the checkbox
  },
  updateButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
});