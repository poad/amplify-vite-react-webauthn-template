import { associateWebAuthnCredential } from 'aws-amplify/auth';
import { useState } from 'react';
import { Show } from '../flow';
import { Alert, Button } from '@aws-amplify/ui-react';

export function RegisterWebAuthn() {
  const [error, setError] = useState<{ message?: string } | undefined>();
  async function registerPassKey() {
    try {
      await associateWebAuthnCredential();
    } catch (e) {
      setError(e as Error);
      console.error(e);
    }
  }

  return (
    <>
      <Button onClick={registerPassKey}>Register PassKey</Button><Show when={error}>
        <Alert variation="error">{error?.message}</Alert>
      </Show>
    </>
  );
}
