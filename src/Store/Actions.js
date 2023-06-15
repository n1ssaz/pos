// and all reducer actions
import API from '../api.js'
import ReducerActions from './ReducerActions.js'

const allActions = {
  ...ReducerActions,
}

// combine all actions and public reducer actions in one object to be exported
const Actions = Object.keys(allActions).reduce((acc, actionName) => {
  if (actionName.startsWith('_')) return acc
  return {
    ...acc,
    [actionName]: allActions[actionName]
  }
}, {})

Actions.hydrateStore = async () => {
  if (Boolean(localStorage.getItem('isLogged'))) {
    const user = await API.get(`users/user/${localStorage.getItem('userid')}`)
    const settings = await API.get('settings/get')
    Actions.setSettings(settings)
    Actions.setUser(user)
  }
  return true
}

export default Actions
