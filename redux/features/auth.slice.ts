import { AuthUserProfile } from "@/interfaces/auth.interface"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { authApi } from "./auth.api"

interface AuthState {
  user: AuthUserProfile | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthUserProfile>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
        if (payload.data?.user) {
          state.user = payload.data.user
          state.isAuthenticated = true
        }
      })
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, { payload }) => {
        if (payload) {
          state.user = payload
          state.isAuthenticated = true
        }
      })
      .addMatcher(authApi.endpoints.updateProfile.matchFulfilled, (state, { payload }) => {
        if (payload) {
          state.user = payload
          state.isAuthenticated = true
        }
      })
      .addMatcher(authApi.endpoints.logOut.matchFulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.user = null
        state.isAuthenticated = false
      })
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
