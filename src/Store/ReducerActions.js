import Store from './Store'

import { reducerActions as authActions } from './Auth'

// just merge them all
const reducerActions = {
  ...authActions,
}

// attach the dispatcher and re-export them all as hash
const actionsNames = Object.keys(reducerActions)
const ReducerActions = actionsNames.reduce((acc, actionName) => {
  return {
    ...acc,
    [actionName]: payload => Store.dispatch(reducerActions[actionName](payload))
  }
}, {})
export default ReducerActions
