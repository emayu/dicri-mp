import * as React from 'react';
import { AppSession } from './types/auth';


export interface SessionContextValue {
  session: AppSession | null;
  setSession: (session: AppSession | null) => void;
}

export const SessionContext = React.createContext<SessionContextValue>({
  session: null,
  setSession: () => {},
});

export function useSession() {
  return React.useContext(SessionContext);
}
