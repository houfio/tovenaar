import { gql, useQuery } from '@apollo/client';
import { format, parseISO } from 'date-fns';
import { useDialoog } from 'dialoog';
import { useEffect } from 'react';

import { AnswersQuery } from '../../apollo/AnswersQuery';
import { AnswersSubscription } from '../../apollo/AnswersSubscription';
import { ViewAnswer } from '../../components/dialogs/ViewAnswer';
import { Heading } from '../../components/Heading';
import { Spinner } from '../../components/Spinner';
import { Table } from '../../components/Table';
import { useAuthGuard } from '../../hooks/useAuthGuard';

const fragment = gql`
  fragment AnswerFragment on AnswerCollection {
    id
    createdAt
    email
    answers {
      id
      asset
      question {
        id
        text
      }
    }
  }
`;

const query = gql`
  query AnswersQuery {
    answers {
      ...AnswerFragment
    }
  }
  ${fragment}
`;

const subscription = gql`
  subscription AnswersSubscription {
    answerSubmitted {
      ...AnswerFragment
    }
  }
  ${fragment}
`;

export default function Answers() {
  const skip = useAuthGuard();
  const { data, loading, subscribeToMore } = useQuery<AnswersQuery>(query, { skip });
  const [, { open }] = useDialoog();

  useEffect(() => {
    subscribeToMore<AnswersSubscription>({
      document: subscription,
      updateQuery: (previous, { subscriptionData }) => ({
        ...previous,
        answers: [
          subscriptionData.data.answerSubmitted,
          ...previous.answers
        ]
      })
    });
  }, [subscribeToMore]);

  return (
    <>
      <Heading text="Answers" type="h1"/>
      <Table
        data={data?.answers ?? []}
        columns={{
          createdAt: {
            label: 'Date',
            format: (value) => format(parseISO(value), 'PPP')
          },
          email: { label: 'E-mail' }
        }}
        loading={loading}
        onClick={(d) => open((props) => (
          <ViewAnswer id={d.id} answers={d.answers} {...props}/>
        ))}
      />
    </>
  );
}
