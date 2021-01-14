import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { DialoogProps } from 'dialoog';
import { useForm } from 'react-hook-form';

import { DeleteQuestionMutation, DeleteQuestionMutationVariables } from '../../apollo/DeleteQuestionMutation';
import { QuestionInput } from '../../apollo/globalTypes';
import { UpsertQuestionMutation, UpsertQuestionMutationVariables } from '../../apollo/UpsertQuestionMutation';
import { useNotifications } from '../../hooks/useNotifications';
import { Dialog } from '../Dialog';
import { Button } from '../form/Button';
import { Form } from '../form/Form';
import { Input } from '../form/Input';

const upsertMutation = gql`
  mutation UpsertQuestionMutation($input: QuestionInput!) {
    upsertQuestion(input: $input) {
      id
      text
      order
    }
  }
`;

const deleteMutation = gql`
  mutation DeleteQuestionMutation($input: IdInput!) {
    deleteQuestion(input: $input) {
      id
    }
  }
`;

type Props = {
  input?: QuestionInput
};

export function UpsertQuestion({ input, ...props }: Props & DialoogProps) {
  const [mutateUpsert, { loading }] = useMutation<UpsertQuestionMutation, UpsertQuestionMutationVariables>(upsertMutation, {
    update: (cache, { data }) => !input?.id && data && cache.modify({
      fields: {
        questions: (q = []) => [...q, data.upsertQuestion]
      }
    })
  });
  const [mutateDelete, { loading: deleteLoading }] = useMutation<DeleteQuestionMutation, DeleteQuestionMutationVariables>(deleteMutation, {
    update: (cache, { data }) => data && cache.modify({
      fields: {
        questions: (q = [], { readField }) => q.filter((i: any) => readField('id', i) !== data.deleteQuestion.id),
        answers: (_, { DELETE }) => DELETE
      }
    })
  });
  const form = useForm({
    defaultValues: input
  });
  const notify = useNotifications();

  return (
    <Dialog text="Question" {...props}>
      <Form
        form={form}
        onSubmit={(values) => mutateUpsert({
          variables: { input: values }
        }).then(props.close).catch((e) => notify(e.graphQLErrors[0].message))}
      >
        <Input name="text" label="Text"/>
        <Input name="order" type="number" label="Order"/>
        {input?.id && (
          <Input name="id" type="hidden" label="ID"/>
        )}
        <Button text="Save" loading={loading} disabled={deleteLoading}/>
        {input?.id && (
          <StyledButton
            text="Delete"
            type="button"
            loading={deleteLoading}
            disabled={loading}
            palette={['gray-500', 'gray-100']}
            onClick={() => mutateDelete({
              variables: { input: { id: input.id! } }
            }).then(props.close).catch((e) => notify(e.graphQLErrors[0].message))}
          />
        )}
      </Form>
    </Dialog>
  );
}

const StyledButton = styled(Button)`
  margin-top: 1rem;
`;
