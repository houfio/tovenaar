import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { faHatWizard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { LoginMutation, LoginMutationVariables } from '../../apollo/LoginMutation';
import { Button } from '../../components/form/Button';
import { Form } from '../../components/form/Form';
import { Input } from '../../components/form/Input';
import { Empty } from '../../components/layout/Empty';
import { useAuthentication } from '../../states/authentication';
import { useNotifications } from '../../hooks/useNotifications';

const mutation = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      token
    }
  }
`;

export default function Login() {
  const [mutate, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(mutation);
  const form = useForm<{ email: string, password: string }>();
  const { push } = useRouter();
  const [, { login }] = useAuthentication();
  const notify = useNotifications();

  return (
    <StyledLogin>
      <StyledIcon icon={faHatWizard}/>
      <StyledBox>
        <Form
          form={form}
          onSubmit={(variables) => mutate({ variables })
            .then(({ data }) => data && login(data.login.token))
            .then(() => push('/admin'))
            .catch((e) => notify(e.graphQLErrors[0].message))}
        >
          <Input name="email" label="Email"/>
          <Input name="password" type="password" label="Password"/>
          <Button text="Login" loading={loading}/>
        </Form>
      </StyledBox>
    </StyledLogin>
  );
}

Login.layout = Empty;

const StyledIcon = styled(FontAwesomeIcon)`
  color: var(--gray-100);
  font-size: 2.5rem;
`;

const StyledLogin = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const StyledBox = styled.div`
  padding: 1rem;
  background-color: var(--gray-200);
  border-radius: 1rem;
`;
