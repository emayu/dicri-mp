import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet, useNavigate } from 'react-router';
import type { Navigation, Session } from '@toolpad/core/AppProvider';
import { SessionContext } from './SessionContext';
import { clearSession, loadInitialSession } from './services/authService';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Menu',
  },
  {
    title: 'Inicio',
    icon: <DashboardIcon />,
  },
  {
    segment: 'expedientes',
    title: 'Expedientes',
    icon: '🗂️',
  },
];

const BRANDING = {
  title: 'Dirección de Investigación Criminalística (DICRI)',
  logo: ( <img src='mp.svg' style={{height:35}}  alt='MP' />)
};

export default function App() {
  const [session, setSession] = React.useState<Session | null>(() => loadInitialSession());  
  const navigate = useNavigate();

  const signIn = React.useCallback(() => {
    navigate('/sign-in');
  }, [navigate]);

  const signOut = React.useCallback(() => {
    setSession(null);
    clearSession();
    navigate('/sign-in');
  }, [navigate]);



  const sessionContextValue = React.useMemo(() => ({ session, setSession }), [session, setSession]);

  return (
    <SessionContext.Provider value={sessionContextValue}>
      <ReactRouterAppProvider
        navigation={NAVIGATION}
        branding={BRANDING}
        session={session}
        authentication={{ signIn, signOut }}
      >
        <Outlet />
      </ReactRouterAppProvider>
    </SessionContext.Provider>
  );
}
