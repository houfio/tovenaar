import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { ComponentPropsWithoutRef } from 'react';

type Props = {
  text: string,
  type: 'h1' | 'h2'
};

export function Heading({ text, type, ...props }: Props & ComponentPropsWithoutRef<'h1'>) {
  return (
    <StyledHeading as={type} {...props}>
      {text}
    </StyledHeading>
  );
}

const styles: Record<Props['type'], SerializedStyles> = {
  h1: css`
    margin-bottom: 2rem;
    font-size: 2rem;
  `,
  h2: css`
    margin-bottom: 1rem;
    font-weight: bold;
    text-transform: uppercase;
  `
};

const StyledHeading = styled.span`
  ${(props) => styles[props.as as Props['type']]};
`;
