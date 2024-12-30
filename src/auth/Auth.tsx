import { useState } from 'react';
import useAuth from './hooks';
import SignOutButton from './SignOutButton';
import { Tabs, Card } from '@aws-amplify/ui-react';
import SignIn from './SignIn';
import { SignUp } from './SignUp';

export function Auth() {
  const { isSignedIn } = useAuth();
  const [tab, setTab] = useState('1');

  if (isSignedIn) {
    return <SignOutButton />;
  }
  return (
    <Card style={{
      borderRadius: '10px',
    }}>
      <Tabs
        value={tab}
        onValueChange={(tab) => setTab(tab)}
        items={[
          {
            label: 'Sign In',
            value: '1',
            content: <SignIn />,
          },
          {
            label: 'Sign Up',
            value: '2',
            content: (
              <SignUp onSignedUp={() => setTab('1')} />
            ),
          },
        ]}
      />
    </Card>
  );
}
