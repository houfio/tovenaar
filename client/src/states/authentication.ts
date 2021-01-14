import { createDakpan } from 'dakpan';

type State = {
  token?: string
};

export const [AuthenticationProvider, useAuthentication] = createDakpan<State>(() => {
  if (typeof localStorage === 'undefined') {
    return {};
  }

  return {
    token: localStorage.getItem('token') || undefined
  };
})({
  login: (token: string) => () => {
    localStorage.setItem('token', token);

    return {
      token
    };
  },
  logout: () => () => {
    localStorage.removeItem('token');

    return {};
  }
});
