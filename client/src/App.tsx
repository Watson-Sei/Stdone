import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './components/pages/home';
import { Signin } from './components/pages/signin';
import { PrivateRoute } from './components/routes/PrivateRoute';
import { PublicRoute } from './components/routes/PublicRoute';
import { Donate } from './components/pages/donate';
import { Error } from './components/pages/error';
import { Header } from './components/common/header';
import { Profile } from './components/pages/profile';

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <header>
            <Header />
          </header>
          <main>
            <div style={{ margin: '2em' }}>
              <Switch>
                <Route exact path="/" component={Home} />
                <PrivateRoute path="/profile" component={Profile} exact />
                <PublicRoute path="/signin" component={Signin} exact={undefined} />
                <Route exact path="/:number([0-9]{1,3})" component={Error} />
                <Route path="/:username" component={Donate} />
              </Switch>
            </div>
          </main>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
