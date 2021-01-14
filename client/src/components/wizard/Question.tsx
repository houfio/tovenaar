import styled from '@emotion/styled';
import { useEffect } from 'react';

import { useIntersection } from '../../hooks/useIntersection';
import { Button } from '../form/Button';
import { FileInput } from '../form/FileInput';
import { Input } from '../form/Input';

type Props = {
  id: string,
  next?: string,
  valid: boolean,
  submitting: boolean,
  current: boolean,
  setCurrent: (id: string) => void
};

export function Question({ id, next, valid, submitting, current, setCurrent }: Props) {
  const [ref, intersection] = useIntersection<HTMLDivElement>();

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setCurrent(id);
    }
  }, [id, intersection?.isIntersecting]);

  return (
    <StyledQuestion id={id} current={current}>
      <div ref={ref}/>
      <StyledInner>
        {next ? (
          <FileInput name={id} accept="image/*"/>
        ) : (
          <Input name="email" label="E-mail address"/>
        )}
        <StyledButton
          text={next ? 'Next' : 'Submit'}
          type={next ? 'button' : 'submit'}
          disabled={!next && !valid}
          loading={!next && submitting}
          onClick={() => next && document.getElementById(next)?.scrollIntoView({
            behavior: 'smooth'
          })}
        />
      </StyledInner>
    </StyledQuestion>
  );
}

const StyledQuestion = styled.div<{ current: boolean }>`
  display: flex;
  align-items: center;
  height: 100vh;
  opacity: ${(props) => props.current ? 1 : .5};
  transition: opacity .25s ease;
`;

const StyledInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledButton = styled(Button)`
  align-self: flex-end;
`;
