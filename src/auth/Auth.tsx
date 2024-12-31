import { useState } from 'react';
import useAuth from './hooks';
import SignOutButton from './SignOutButton';
import { Tabs, Card, Flex } from '@aws-amplify/ui-react';
import SignIn from './SignIn';
import { SignUp } from './SignUp';
import { Show } from '../flow';
import { RegisterWebAuthn } from './RegisterWebAuthn';
// import { ListRegisterdWebAuthn } from './ListRegisterdWebAuthn';

export function Auth() {
  const { isSignedIn } = useAuth();
  const [tab, setTab] = useState('signin');

  return (
    <Show when={!isSignedIn} fallback={
      <Flex direction="column" gap="small">
        <SignOutButton />
        <RegisterWebAuthn />
        {/* <ListRegisterdWebAuthn /> */}
      </Flex>
    }>
      <Card style={{
        borderRadius: '10px',
      }}>
        <Tabs
          value={tab}
          onValueChange={(tab) => setTab(tab)}
          items={[
            {
              label: 'Sign In',
              value: 'signin',
              content: <SignIn />,
            },
            {
              label: 'Sign Up',
              value: 'signup',
              content: (
                <SignUp onSignedUp={() => setTab('1')} />
              ),
            },
          ]}
        />
      </Card>
    </Show>
  );
}
