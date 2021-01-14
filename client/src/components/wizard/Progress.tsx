import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { forBreakpoint } from '../../utils/forBreakpoint';

type Props = {
  current: string,
  questions: {
    id: string,
    complete: boolean
  }[]
};

export function Progress({ current, questions }: Props) {
  return (
    <StyledProgress>
      {questions.map(({ id, complete }, i) => (
        <StyledDot
          key={id}
          title={`Question ${i + 1}`}
          current={current === id}
          complete={complete}
          onClick={() => document.getElementById(id)?.scrollIntoView({
            behavior: 'smooth'
          })}
        />
      ))}
    </StyledProgress>
  );
}

const StyledProgress = styled.div`
  position: absolute;
  left: 0;
  display: none;
  flex-direction: column;
  ${forBreakpoint('tabletPortrait', css`
    display: flex;
  `)};
`;

const StyledDot = styled.button<{ current: boolean, complete: boolean }>`
  width: .5rem;
  height: .5rem;
  background-color: var(--${(props) => props.complete ? 'blue-200' : 'gray-300'});
  border-radius: 50%;
  opacity: ${(props) => props.current ? 1 : .5};
  transition: background-color .25s ease, opacity .25s ease;
  &:not(:last-child) {
    margin-bottom: .5rem;
  }
`;
