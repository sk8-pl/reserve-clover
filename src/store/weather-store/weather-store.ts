/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

// const getDataWeather = () => {
//   const data = fetch('https://prj.int-sys.net/_prj/mbla3/webvis/weather/57.03/53.00/')
//     .then((response) => response.json())
//     .then((response) => response)
//     .catch((error) => error);
//   return data;
// };

export const counterSlice = createSlice({
  name: 'weather',
  initialState: {
    value: false,
  },
  reducers: {
    setPointWeather: (state, action) => {
      state.value = action.payload.value;
    },
  },
});

export const { setPointWeather } = counterSlice.actions;

export default counterSlice.reducer;
