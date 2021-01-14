import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { DialoogProps, useDialoog } from 'dialoog';

import { useTimeout } from '../hooks/useTimeout';

type Props = {
  text: string
};

export function Notification({ text, index, open, close, remove }: Props & DialoogProps) {
  const [{ dialogs }] = useDialoog();

  useTimeout(2500, close, []);

  const total = dialogs.filter((dialog) => dialog.stack === 'notifications').length - 1;

  return (
    <StyledNotification
      index={total - index}
      open={open}
      onClick={close}
      onAnimationEnd={() => !open && remove()}
    >
      {text}
    </StyledNotification>
  );
}

const slideIn = keyframes`
  from {transform: translateX(calc(-100% - 2rem));}
  to {transform: none;}
`;

const slideOut = keyframes`
  from {transform: none;}
  to {transform: translateX(calc(-100% - 2rem));}
`;

const StyledNotification = styled('button', {
  shouldForwardProp: (p) => p !== 'index' && p !== 'open'
})<{ index: number, open: boolean }>`
  position: fixed;
  align-items: center;
  display: flex;
  bottom: ${(props) => props.index * 4 + 1}rem;
  left: 1rem;
  max-width: calc(100% - 2rem);
  height: 3rem;
  padding: 0 1rem;
  color: var(--blue-300);
  background-color: var(--blue-100);
  border-radius: .5rem;
  outline: none;
  transition: bottom .25s ease, box-shadow .25s ease;
  animation: ${(props) => props.open ? slideIn : slideOut} .25s ease;
  z-index: 600;
  &:focus {
    box-shadow: 0 0 0 3px var(--gray-500);
  }
`;
