import { gql, useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { faHatWizard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { WizardMutation, WizardMutationVariables } from '../apollo/WizardMutation';
import { WizardQuery } from '../apollo/WizardQuery';
import { Button } from '../components/form/Button';
import { Form } from '../components/form/Form';
import { Heading } from '../components/Heading';
import { Column } from '../components/layout/Column';
import { Container } from '../components/layout/Container';
import { Empty } from '../components/layout/Empty';
import { Row } from '../components/layout/Row';
import { Progress } from '../components/wizard/Progress';
import { Question } from '../components/wizard/Question';
import { useNotifications } from '../hooks/useNotifications';

const query = gql`
  query WizardQuery {
    questions {
      id
      text
      order
    }
  }
`;

const mutation = gql`
  mutation WizardMutation($input: CollectionInput!) {
    createCollection(input: $input) {
      id
      answers {
        id
        question {
          text
        }
        asset
      }
    }
  }
`;

export default function Wizard() {
  const { data, loading } = useQuery<WizardQuery>(query);
  const [mutate, { loading: submitLoading }] = useMutation<WizardMutation, WizardMutationVariables>(mutation);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState<string>();
  const form = useForm();

  const { dirtyFields } = form.formState;
  const questions = [
    ...data?.questions ?? [],
    {
      id: 'email',
      text: 'Enter your e-mail address.',
      order: Number.POSITIVE_INFINITY
    }
  ].sort((a, b) => a.order - b.order);
  const progress = questions.map(({ id }) => ({
    id,
    complete: dirtyFields[id] ?? false
  }));
  const notify = useNotifications();

  return (
    <Container edges={{ phone: ['gray-100', 'gray-0'] }}>
      <Row spacing={{ phone: [1, 0], tabletPortrait: [4, 0] }}>
        <StyledLeftColumn sizes={{ phone: 6 }}>
          <StyledIcon icon={faHatWizard}/>
          {started && (
            <>
              <Progress
                current={current ?? ''}
                questions={progress}
              />
              <StyledHeading
                text={`Question ${questions.findIndex(({ id }) => id === current) + 1}/${questions.length}`}
                type="h2"
              />
            </>
          )}
          <StyledHeading
            text={started ? questions.find(({ id }) => id === current)?.text ?? '' : 'Welcome to Tovenaar!'}
            type="h1"
          />
        </StyledLeftColumn>
        <StyledColumn sizes={{ phone: 6 }}>
          {!started ? (
            <>
              Ready to start your once-in-a-lifetime questionnaire experience?!
              <StyledButton
                text="Start"
                loading={loading}
                onClick={() => {
                  setStarted(true);

                  for (const question of questions) {
                    form.register(question.id, { required: true });
                  }
                }}
              />
            </>
          ) : (
            <Form
              form={form}
              onSubmit={(values) => mutate({
                variables: {
                  input: {
                    email: values.email,
                    answers: Object.entries(values).filter(([key]) => key !== 'email').map(([questionId, file]) => ({
                      questionId,
                      file
                    }))
                  }
                }
              }).then(() => notify('success'))
                .then(() => {
                  form.reset();
                  setStarted(false);
                })
                .catch((e) => notify(e.graphQLErrors[0].message))}
            >
              {questions.map(({ id }, i) => (
                <Question
                  key={id}
                  id={id}
                  next={questions[i + 1]?.id}
                  valid={progress.every(({ complete }) => complete)}
                  submitting={submitLoading}
                  current={current === id}
                  setCurrent={setCurrent}
                />
              ))}
            </Form>
          )}
        </StyledColumn>
      </Row>
    </Container>
  );
}

Wizard.layout = Empty;

const StyledColumn = styled(Column)`
  justify-content: center;
  align-items: flex-start;
`;

const StyledLeftColumn = styled(StyledColumn)`
  position: sticky;
  top: 0;
  background-color: var(--gray-100);
  height: 100vh;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 1.5rem;
  color: var(--gray-0);
  font-size: 2.5rem;
`;

const StyledHeading = styled(Heading)`
  margin-bottom: 0;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
`;
