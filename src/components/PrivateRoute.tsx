import { Navigate } from 'react-router-dom';
import { JSX } from 'react/jsx-runtime';

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: Props): JSX.Element {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
