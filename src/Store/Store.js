import { configureStore } from '@reduxjs/toolkit'

import auth from './Auth'

export default configureStore({
  reducer: {
    auth,
  },
  devTools: ['development', 'staging'].includes(process.env.REACT_APP_ENV)
})
