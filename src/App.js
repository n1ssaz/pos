import { Provider } from 'react-redux';
import './App.css';
import { Router } from './Routes';
import Actions from './Store/Actions';
import Store from './Store/Store';
import { useState } from 'react';
import { Spin } from 'antd';
function App() {
  const [loading, setLoading] = useState(true)
  Actions.hydrateStore().then(() => {
    setLoading(false)
  })
  if (loading) return <Spin />
  return (
    <Provider store={Store}>
      <Router />
    </Provider>
  );
}

export default App;
