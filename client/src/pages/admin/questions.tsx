import { gql, useQuery } from '@apollo/client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDialoog } from 'dialoog';
import { useState } from 'react';

import { QuestionsQuery } from '../../apollo/QuestionsQuery';
import { UpsertQuestion } from '../../components/dialogs/UpsertQuestion';
import { Button } from '../../components/form/Button';
import { Input } from '../../components/form/Input';
import { Heading } from '../../components/Heading';
import { Table } from '../../components/Table';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { forBreakpoint } from '../../utils/forBreakpoint';

const query = gql`
  query QuestionsQuery {
    questions {
      id
      text
      order
    }
  }
`;

export default function Questions() {
  const skip = useAuthGuard();
  const { data, loading } = useQuery<QuestionsQuery>(query, { skip });
  const [value, setValue] = useState('');
  const [, { open }] = useDialoog();

  return (
    <>
      <Heading text="Questions" type="h1"/>
      <StyledActions>
        <Input name="search" label="Search" value={value} onChange={(e) => setValue(e.target.value)}/>
        <StyledButton
          text="Add"
          onClick={open.c((props) => (
            <UpsertQuestion {...props}/>
          ))}
        >
          <FontAwesomeIcon icon={faPlus}/>
          <StyledText>
            Add
          </StyledText>
        </StyledButton>
      </StyledActions>
      <Table
        data={[...data?.questions ?? []]
          .sort((a, b) => a.order - b.order)
          .filter((a) => a.text.toLowerCase().indexOf(value.toLowerCase()) !== -1)
        }
        columns={{
          text: { label: 'Question' },
          order: { label: 'Order' }
        }}
        loading={loading}
        onClick={(d) => open((props) => (
          <UpsertQuestion input={d} {...props}/>
        ))}
      />
    </>
  );
}

const StyledActions = styled.div`
  display: flex;
  & > :first-child {
    flex: 1;
  }
`;

const StyledButton = styled(Button)`
  margin: 0 0 1rem 1rem;
`;

const StyledText = styled.span`
  display: none;
  margin-left: .5rem;
  ${forBreakpoint('tabletLandscape', css`
    display: inline-block;
  `)};
`;
