/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'actualMode',
  initialState: {
    value: 'Route-mode',
  },
  reducers: {
    pickActualMode: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { pickActualMode } = counterSlice.actions;

export default counterSlice.reducer;
