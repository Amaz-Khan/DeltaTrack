import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  loading: boolean;
}

const initialState: AuthState = {
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    stopLoading(state) {
      state.loading = false;
    },
  },
});

export const { startLoading, stopLoading } = authSlice.actions;
export default authSlice.reducer;
