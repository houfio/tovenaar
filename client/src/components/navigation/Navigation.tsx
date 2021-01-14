import styled from '@emotion/styled';
import { faListAlt, faPenSquare, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

import { NavigationItem } from './NavigationItem';

export function Navigation() {
  return (
    <StyledNavigation>
      <NavigationItem text="Dashboard" href="/admin" icon={faTachometerAlt} exact={true}/>
      <NavigationItem text="Answers" href="/admin/answers" icon={faListAlt}/>
      <NavigationItem text="Questions" href="/admin/questions" icon={faPenSquare}/>
    </StyledNavigation>
  );
}

const StyledNavigation = styled.nav`
  position: sticky;
  display: flex;
  flex-direction: column;
  top: 4rem;
  height: calc(100vh - 4rem);
  padding: 1rem 1rem 0 0;
  background-color: var(--gray-200);
  border-radius: 0 1rem 0 0;
`;
