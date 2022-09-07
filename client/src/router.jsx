import { useRoutes } from 'react-router-dom';
import Home from './Home';
import AuthHoc from './AuthHoc';
import Login from './pages/Login';

const routes = [
  {
    path: '',
    element: <Home />,
  },
  {
    path: 'login',
    element: <Login />,
  },
];

const Routes = () => {
  return useRoutes(routes);
};

export default Routes;
