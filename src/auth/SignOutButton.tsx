import { Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import useAuth from './hooks';
import { JSX } from 'react';

export function SignOutButton(props: { onSignOut?: () => void }): JSX.Element {
  const { isSignedIn, signOut } = useAuth();

  if (!isSignedIn) {
    return <></>;
  }

  return (
    <Button
      onClick={() => {
        signOut({ global: true });
        props.onSignOut?.();
      }
      }
    >
      Sign out
    </Button>
  );
}

export default SignOutButton;
