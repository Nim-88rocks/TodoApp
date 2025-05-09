A simple React Native app for managing tasks with authentication using the DummyJSON API. Users can log in, add, update, complete, and delete todos.
User login with DummyJSON API
Add, update, delete, and toggle todos
Secure token and userId storage
Modern UI built with React Native
 Pull-to-refresh todo list

// tech Stack //
React Native
Expo
DummyJSON API
SecureStore (for auth token storage)
React Context API

// setup //
look for a folder named 'setup' master branch 

// Known Issues //
Expo Go may throw a Failed to download remote update error → try
npx expo start --clear
and ensure the same network on phone and PC.
DummyJSON is a mock API; todo changes are not persisted permanently.

