import { Button } from '../../components/form/Button';
import { Heading } from '../../components/Heading';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { useAuthentication } from '../../states/authentication';

export default function Dashboard() {
  const [, { logout }] = useAuthentication();

  useAuthGuard();

  return (
    <>
      <Heading text="Dashboard" type="h1"/>
      Welcome to Tovenaar!
      <Button text="Logout" onClick={logout}/>
    </>
  );
}
