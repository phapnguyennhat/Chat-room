import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const spinnerSlice = createSlice({
  name: 'spinner',
  initialState: {
    value: false
  },
  reducers: {
    setSpinner: (state, action: PayloadAction<boolean>) =>{
      state.value=action.payload
    }
  }
})

export const {setSpinner} = spinnerSlice.actions
export default spinnerSlice.reducer