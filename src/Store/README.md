## Store

 - the store is a `react-redux` store and it is wrapped with store provider from up to bottom.
 - in the Store.js we import all slices from the folders
 
## ReducerActions

 - every slice introduces a bunch of reducer actions (state-actions) that can be public or private.
 - the private reducer actions are prefixed with `_underscore` and will not be exposed as Actions
 - the public reducer actions are translated directily into action into Actions

## Hydration
 - the hydration of the store are the actions to be invoked when the app is initialised only once

## Actions
- the Actions object will contain all the actions defined in one place and are either translated public reducer actions, either are complex actions that are using raw public and private reducer actions to create a more advanced async actions
