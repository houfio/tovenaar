import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { DialoogProps } from 'dialoog';

import { AnswersQuery_answers_answers } from '../../apollo/AnswersQuery';
import { DeleteAnswerMutation, DeleteAnswerMutationVariables } from '../../apollo/DeleteAnswerMutation';
import { useNotifications } from '../../hooks/useNotifications';
import { Dialog } from '../Dialog';
import { Button } from '../form/Button';
import { Slider } from '../Slider';

const mutation = gql`
  mutation DeleteAnswerMutation($input: IdInput!) {
    deleteCollection(input: $input) {
      id
    }
  }
`;

type Props = {
  id: string,
  answers: AnswersQuery_answers_answers[]
};

export function ViewAnswer({ id, answers, ...props }: Props & DialoogProps) {
  const [mutate, { loading }] = useMutation<DeleteAnswerMutation, DeleteAnswerMutationVariables>(mutation, {
    update: (cache, { data }) => data && cache.modify({
      fields: {
        answers: (a, { readField }) => a.filter((i: any) => readField('id', i) !== data.deleteCollection.id)
      }
    })
  });
  const notify = useNotifications();

  return (
    <Dialog text="Answer" {...props}>
      <Slider
        data={answers}
        render={(answer) => (
          <div>
            <StyledAsset asset={`${process.env.NEXT_PUBLIC_UPLOADS}/${id}/${answer.asset}`}/>
            <StyledQuestion>
              {answer.question.text}
            </StyledQuestion>
          </div>
        )}
        width="25rem"
      />
      <StyledButton
        text="Delete"
        type="button"
        loading={loading}
        palette={['gray-500', 'gray-100']}
        onClick={() => mutate({
          variables: { input: { id } }
        }).then(props.close).catch((e) => notify(e.graphQLErrors[0].message))}
      />
    </Dialog>
  );
}

const StyledAsset = styled.div<{ asset: string }>`
  padding-top: 56.25%;
  background: url("${(props) => props.asset}") center no-repeat;
  background-size: cover;
  border-radius: .5rem;
`;

const StyledQuestion = styled.span`
  display: block;
  margin-top: 1.25rem;
  color: var(--gray-300);
  font-size: .75rem;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 1.25rem;
`;
