import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addService, removeService} from '../../api';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('auth');
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

// Add Item API Call
export const addItemAsync = createAsyncThunk(
  'order/addItem',
  async ({name, id}, {rejectWithValue}) => {
    try {
      const auth = await getData();
      if (!auth?.uid) throw new Error('User authentication missing');

      const response = await addService({uid: auth.uid, name, id});
      console.log('Add Item API Success:', response.data);

      return response.data; // Expected: Updated full order list [{ id, name }, { id, name }]
    } catch (error) {
      console.error('Add Item API Error:', error);
      return rejectWithValue(error.response?.data || 'Failed to add item');
    }
  },
);

// Remove Item API Call
export const removeItemAsync = createAsyncThunk(
  'order/removeItem',
  async ({name, id}, {rejectWithValue}) => {
    try {
      const auth = await getData();
      if (!auth?.uid) throw new Error('User authentication missing');

      const response = await removeService({uid: auth.uid, name, id});
      console.log('Remove Item API Success:', response.data);

      return response.data; // Expected: Updated full order list [{ id, name }]
    } catch (error) {
      console.error('Remove Item API Error:', error);
      return rejectWithValue(error.response?.data || 'Failed to remove item');
    }
  },
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addItemAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemAsync.fulfilled, (state, action) => {
        console.log('Updating state with full order list:', action.payload);
        state.items = action.payload; // ✅ Replace full list
        state.loading = false;
      })
      .addCase(addItemAsync.rejected, (state, action) => {
        console.error('Add Item API Failed:', action.payload);
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(removeItemAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemAsync.fulfilled, (state, action) => {
        console.log(
          'Updating state with full order list after removal:',
          action.payload,
        );
        state.items = action.payload; // ✅ Replace full list
        state.loading = false;
      })
      .addCase(removeItemAsync.rejected, (state, action) => {
        console.error('Remove Item API Failed:', action.payload);
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default orderSlice.reducer;
