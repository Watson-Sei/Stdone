import { Route, Redirect } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export const PrivateRoute = ({ component, exact, path }) => {
    const { user } = useAuthContext();

    console.log('user:', user);
    
    return user ? (
        <Route exact={exact} path={path} component={component} />
    ) : (
        <Redirect to="/signin" />
    );
};