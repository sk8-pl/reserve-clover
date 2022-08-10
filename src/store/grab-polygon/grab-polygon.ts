/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'isGrab',
  initialState: {
    value: false,
    polygonVertices: [],
  },
  reducers: {
    pickPolygon: (state, action) => {
      state.value = action.payload.value;
      state.polygonVertices = action.payload.polygonVertices;
    },
  },
});

export const { pickPolygon } = counterSlice.actions;

export default counterSlice.reducer;
