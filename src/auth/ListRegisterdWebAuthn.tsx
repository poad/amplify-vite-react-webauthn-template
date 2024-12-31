import { listWebAuthnCredentials } from 'aws-amplify/auth';
import { Suspense } from 'react';

export async function ListRegisterdWebAuthn() {

  return (
    <>
      <Suspense>
        {(await listWebAuthnCredentials()).credentials.map((credential) => (<>{credential.friendlyCredentialName}</>))}
      </Suspense>

    </>
  );
}
