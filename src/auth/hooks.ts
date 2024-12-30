import React, { useEffect, useCallback } from 'react';
import {
  fetchAuthSession,
  AuthUser,
  getCurrentUser,
  FetchUserAttributesOutput,
  fetchUserAttributes,
} from 'aws-amplify/auth';
import { AuthEventData } from '@aws-amplify/ui';
import { useAuthenticator } from '@aws-amplify/ui-react';

const useAuth = (): {
  user?: AuthUser;
  token?: string;
  attributes?: FetchUserAttributesOutput;
  signOut: (data?: AuthEventData | undefined) => void;
  isSignedIn: boolean;
  refetch: () => void
} => {
  const [user, setUser] = React.useState<AuthUser | undefined>();
  const [token, setToken] = React.useState<string | undefined>(undefined);
  const [attributes, setAttributes] = React.useState<
    FetchUserAttributesOutput | undefined
  >();
  const {
    authStatus,
    signOut,
  } = useAuthenticator((context) => [
    context.authStatus,
    context.signOut,
  ]);

  const refetch = useCallback(async () => {
    const { idToken } = (await fetchAuthSession()).tokens ?? {};
    setToken(idToken?.toString());
  }, []);
  const handleAuth = async () => {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      setToken(idToken?.toString());

      await getCurrentUser().then((currentUser) => {
        setUser(currentUser);
        return currentUser;
      });

      void await fetchUserAttributes().then((attr) => {
        setAttributes(attr);
        return attr;
      });
    } catch {
      setToken(undefined);
      setUser(undefined);
      setAttributes(undefined);
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return {
    user,
    token,
    attributes,
    signOut,
    isSignedIn: authStatus === 'authenticated',
    refetch,
  };
};

export default useAuth;
