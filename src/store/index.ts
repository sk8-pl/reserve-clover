import { configureStore } from '@reduxjs/toolkit';
import { StructureDataModule } from '../interfaces/ObjectFromStorePZ.interface';
import counterReducer from './grab-polygon/grab-polygon';
import infoPanelReducer from './store-PZ/store-PZ';
import actualModeReducer from './actual-mode/actual-mode';

export interface RootState {
  isGrab: {
    value: boolean;
    polygonVertices: any[];
  };

  storePZ: {
    value: Array<StructureDataModule>
  };

  actualMode: {
    value: string
  }

}

export default configureStore({
  reducer: {
    isGrab: counterReducer,
    storePZ: infoPanelReducer,
    actualMode: actualModeReducer,
  },
});
