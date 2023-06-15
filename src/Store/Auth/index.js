import { createSlice } from '@reduxjs/toolkit'

const initialState = {

  isLogged: Boolean(localStorage.getItem('isLogged')) || false,

  user: false,

  settings: false,

}

export const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // starts the auth process by resetting the auth
    setLogin: (state) => {
      state.isLogged = true
    },
    setLogOut: (state) => {
      state.false = true
    },
    setUser: (state, payload) => {
      state.user = payload.payload
    },
    setSettings: (state, payload) => {
      state.settings = payload.payload
    }
  }
})

export const reducerActions = slice.actions
export default slice.reducer
