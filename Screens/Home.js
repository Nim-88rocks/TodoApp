import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import TaskItem from '../Components/Items';
import TaskInput from '../Components/inputItems';
import { Add, GetTodosByUserId, UpdateTodo } from '../Context/Operations';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../Context/AuthContext';

export default function Home() {
  const { logout, userId } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [updatedText, setUpdatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTodos = async () => {
    if (!userId) {
      console.error('User ID is not available.');
      return;
    }

    setLoading(true);
    try {
      const todos = await GetTodosByUserId(userId);
      setTasks(todos.map(todo => ({
        id: todo.id,
        text: todo.todo,
        completed: todo.completed
      })));
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      Alert.alert('Error', 'Failed to fetch todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [userId]);

  const addTask = async (taskText) => {
    if (!userId) {
      console.error('User ID is not available.');
      return;
    }

    try {
      const newTodo = await Add(taskText, false, userId);
      setTasks(prev => [...prev, {
        id: newTodo.id,
        text: newTodo.todo,
        completed: newTodo.completed
      }]);
      Alert.alert('Success', 'Todo added successfully!');
    } catch (error) {
      console.error('Failed to add todo:', error);
      Alert.alert('Error', 'Failed to add todo. Please try again.');
    }
  };

  const updateTask = async () => {
    if (!currentTaskId || !updatedText.trim()) {
      Alert.alert('Error', 'Please enter a valid task text.');
      return;
    }

    try {
      const updatedTask = await UpdateTodo(currentTaskId, { todo: updatedText.trim() });
      setTasks(prev =>
        prev.map(task =>
          task.id === currentTaskId ? { ...task, text: updatedTask.todo } : task
        )
      );
      closeModal();
      Alert.alert('Success', 'Todo updated successfully!');
    } catch (error) {
      console.error('Failed to update todo:', error);
      Alert.alert('Error', 'Failed to update todo. Please try again.');
    }
  };

  const completeTask = async (id) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    try {
      const updatedTask = await UpdateTodo(id, { completed: !taskToUpdate.completed });
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, completed: updatedTask.completed } : task
        )
      );
      Alert.alert('Success', 'Todo status updated!');
    } catch (error) {
      console.error('Failed to update todo:', error);
      Alert.alert('Error', 'Failed to update todo. Please try again.');
    }
  };

  const openUpdateModal = (id, text) => {
    setCurrentTaskId(id);
    setUpdatedText(text);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setUpdatedText('');
    setCurrentTaskId(null);
  };

  const renderItem = ({ item }) => (
    <TaskItem
      task={item}
      onComplete={() => completeTask(item.id)}
      onUpdate={() => openUpdateModal(item.id, item.text)}
    />
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>To Do Next</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007aff" />
          ) : (
            <FlatList
              data={tasks}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ flexGrow: 1 }}
              onRefresh={fetchTodos}
              refreshing={refreshing}
            />
          )}

          <TaskInput onAddTask={addTask} />

          <TouchableOpacity style={styles.logoutTouchable} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* Update Modal */}
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}
          >
            <TouchableWithoutFeedback onPress={closeModal}>
              <View style={styles.modalContainer}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Update Task</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={updatedText}
                      onChangeText={setUpdatedText}
                      placeholder="Enter updated task"
                    />
                    <View style={styles.modalButtons}>
                      <Button title="Cancel" onPress={closeModal} />
                      <Button title="Update" onPress={updateTask} />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f3f6',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  logoutTouchable: {
    backgroundColor: '#ff5c5c',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});