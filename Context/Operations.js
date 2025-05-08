import axios from 'axios';

export const Add = async (todo, completed, userId) => {
  try {
    const response = await axios.post(
      'https://dummyjson.com/todos/add',
      {
        todo,
        completed,
        userId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('New Todo Added:', response.data);
    return response.data; // Return the newly created todo
  } catch (error) {
    console.error('Error adding todo:', error.response?.data || error.message);
    throw error; // Re-throw the error for further handling
  }
};

export const GetTodosByUserId = async (userId) => {
  try {
    const response = await axios.get(`https://dummyjson.com/todos/user/${userId}`);
    console.log('Todos for User:', response.data);
    return response.data.todos; // Return the list of todos
  } catch (error) {
    console.error('Error fetching todos:', error.response?.data || error.message);
    throw error; // Re-throw the error for further handling
  }
};

// Function to update a todo
export const UpdateTodo = async (todoId, updatedData) => {
  try {
    const response = await axios.put(
      `https://dummyjson.com/todos/${todoId}`,
      updatedData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Todo Updated:', response.data);
    return response.data; // Return the updated todo
  } catch (error) {
    console.error('Error updating todo:', error.response?.data || error.message);
    throw error; // Re-throw the error for further handling
  }
};

export const CompleteTodo = async (todoId) => {
  try {
    const response = await axios.delete(`https://dummyjson.com/todos/${todoId}`);
    console.log('Todo Completed (Simulated Delete):', response.data);
    return response.data; // Return the simulated deleted todo
  } catch (error) {
    console.error('Error completing todo:', error.response?.data || error.message);
    throw error; // Re-throw the error for further handling
  }
};