import styled from '@emotion/styled';
import { faHatWizard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactElement } from 'react';

import { Navigation } from '../navigation/Navigation';

import { Column } from './Column';
import { Container } from './Container';
import { Row } from './Row';

type Props = {
  children?: ReactElement
};

export function Default({ children }: Props) {
  return (
    <>
      <StyledContainer edges={{ phone: ['gray-0', 'gray-0'] }}>
        <Row spacing={{ phone: [1, 0], tabletLandscape: [2, 0] }}>
          <StyledColumn sizes={{ phone: 3, laptop: 2 }}>
            <StyledIcon icon={faHatWizard}/>
          </StyledColumn>
        </Row>
      </StyledContainer>
      <Container edges={{ phone: ['gray-200', 'gray-0'] }}>
        <Row spacing={{ phone: [1, 0], tabletLandscape: [2, 0] }}>
          <Column sizes={{ phone: 3, laptop: 2 }}>
            <Navigation/>
          </Column>
          <Column sizes={{ phone: 9, laptop: 10 }}>
            <main>
              {children}
            </main>
          </Column>
        </Row>
      </Container>
    </>
  );
}

const StyledContainer = styled(Container)`
  position: sticky;
  top: 0;
`;

const StyledColumn = styled(Column)`
  justify-content: flex-end;
  align-items: center;
  height: 4rem;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin-right: 1rem;
  color: var(--gray-100);
  font-size: 2.5rem;
`;
