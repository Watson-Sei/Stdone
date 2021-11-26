import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Home } from './components/pages/home';
import { Signin } from './components/pages/signin';
import { PrivateRoute } from './components/routes/PrivateRoute';
import { PublicRoute } from './components/routes/PublicRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ margin: '2em' }}>
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <PublicRoute path="/signin" component={Signin} exact={undefined} />
          </Switch>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
