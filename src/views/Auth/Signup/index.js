import { Route, Routes } from 'react-router-dom';
import SignupView from './Signup';
import ConfirmEmailView from './ConfirmEmail';

/**
 * Routes for "Signup" flow
 * url: /auth/signup/*
 */
const SignupRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/signup/confirm-email">
        <ConfirmEmailView />
      </Route>
      <Route path="/auth/signup">
        <SignupView />
      </Route>
      <Route>
        <SignupView />
      </Route>
    </Routes>
  );
};

export default SignupRoutes;
