import { useDialoog } from 'dialoog';
import { useCallback } from 'react';

import { Notification } from '../components/Notification';

export function useNotifications() {
  const [, { open }] = useDialoog();

  return useCallback((text: string) => void open((props) => (
    <Notification text={text} {...props}/>
  ), { stack: 'notifications', capture: false }), [open]);
}
