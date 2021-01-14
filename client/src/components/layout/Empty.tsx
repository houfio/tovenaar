import { ReactElement } from 'react';

type Props = {
  children?: ReactElement
};

export function Empty({ children }: Props) {
  return (
    <main>
      {children}
    </main>
  );
}
