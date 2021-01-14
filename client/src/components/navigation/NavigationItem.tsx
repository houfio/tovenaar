import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { forBreakpoint } from '../../utils/forBreakpoint';
import { Button } from '../form/Button';

type Props = {
  text: string,
  href: string,
  icon: IconProp,
  exact?: boolean
};

export function NavigationItem({ text, href, icon, exact = false }: Props) {
  const { pathname } = useRouter();

  return (
    <Link href={href} passHref={true}>
      <StyledButton
        as="a"
        text={text}
        palette={['gray-500', (exact ? pathname === href : pathname.startsWith(href)) ? 'gray-0' : 'gray-100']}
      >
        <FontAwesomeIcon icon={icon}/>
        <StyledText>
          {text}
        </StyledText>
      </StyledButton>
    </Link>
  )
}

const StyledButton = styled(Button)`
  margin-bottom: 1rem;
`;

const StyledText = styled.span`
  display: none;
  margin-left: .5rem;
  ${forBreakpoint('tabletLandscape', css`
    display: inline-block;
  `)};
`;
