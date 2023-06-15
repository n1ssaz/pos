import Store from './Store'
import Actions from './Actions'
import API from '#API'

export { default as Actions } from './Actions'
export * from './Hooks'

export { default as Store } from './Store'

/* istanbul ignore if */ // in development attach the store and actions to the window
if (['development', 'staging'].includes(process.env.REACT_APP_ENV)) {
  window.Store = Store
  window.Actions = Actions
  window.API = API
}
