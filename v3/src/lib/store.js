import { configureStore } from '@reduxjs/toolkit';
import valueDataReducer from '../data/valueData';

export default configureStore({
  reducer: {
    valueData:valueDataReducer
  }
});
