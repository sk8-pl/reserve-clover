/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { StructureDataModule } from '../../interfaces/ObjectFromStorePZ.interface';

export const counterSlice = createSlice({
  name: 'storePZ',
  initialState: {
    value: [] as Array<StructureDataModule>,
  },

  // initialState: {
  //   value: [
  //     {
  //       name: 'agro-module',
  //       flyMissions: [
  //         {
  //           name: 'agro-module_1',
  //           points: [
  //             {
  //               lat: '33.177662061247275',
  //               lon: '69.07901571488952',
  //               alt: 50,
  //               speed: '10',
  //               actions: [],
  //             },
  //             {
  //               lat: '33.17195802138755',
  //               lon: '69.07869024057663',
  //               alt: 31,
  //               speed: '10',
  //               actions: [],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       name: 'module_example_2',
  //       flyMissions: [
  //         {
  //           name: 'module_example_2_1',
  //           points: [
  //             {
  //               lat: '33.177662061247275',
  //               lon: '69.07901571488952',
  //               alt: 50,
  //               speed: '10',
  //               actions: [],
  //             },
  //             {
  //               lat: '33.177662061247275',
  //               lon: '69.07901571488952',
  //               alt: 50,
  //               speed: '10',
  //               actions: [],
  //             },
  //           ],
  //         },
  //         {
  //           name: 'module_example_2_2',
  //           points: [
  //             {
  //               lat: '33.177662061247275',
  //               lon: '69.07901571488952',
  //               alt: 50,
  //               speed: '10',
  //               actions: [],
  //             },
  //             {
  //               lat: '33.17195802138755',
  //               lon: '69.07869024057663',
  //               alt: 31,
  //               speed: '10',
  //               actions: [],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  reducers: {
    pushModePZ: (state, action) => {
      const objectModule: StructureDataModule = {
        name: action.payload[0],
        flyMissions: [],
      };
      if (!state.value.map((e) => e.name).includes(action.payload[0])) {
        objectModule.flyMissions.push({ name: action.payload[1], points: [] });
        state.value.push(objectModule);
      } else {
        const indexMode = state.value.map((e) => e.name).indexOf(action.payload[0]);
        const arrayNamesFlyMissions = state.value[indexMode].flyMissions.map((e) => e.name);
        if (!arrayNamesFlyMissions.includes(action.payload[1])) {
          state.value[indexMode].flyMissions.push({ name: action.payload[1], points: [] });
        }
      }
    },
  },
});

export const { pushModePZ } = counterSlice.actions;

export default counterSlice.reducer;
