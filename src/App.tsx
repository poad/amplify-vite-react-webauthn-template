import { JSX, useState } from 'react';
import { Auth } from './auth/Auth';

import '@aws-amplify/ui-react/styles.css';
import { Alert, useAuthenticator } from '@aws-amplify/ui-react';
import { Show } from './flow';
import { AuthUser, getCurrentUser } from 'aws-amplify/auth';

/**
 * Appコンポーネントは、認証関連のUIを表示するためのメインコンポーネントです。
 *
 * @returns {JSX.Element} アプリケーションのメインUIにAuthコンポーネントを表示
 */
function App(): JSX.Element {
  const {
    authStatus,
  } = useAuthenticator((context) => [
    context.authStatus,
  ]);
  const [user, setUser] = useState<AuthUser>();
  const [error, setError] = useState<Error>();
  if (authStatus === 'authenticated') {
    getCurrentUser().then((user) => setUser(user)).catch(setError);
  }

  return (
    <main>
      {/* 認証コンポーネントを表示 */}
      <Auth />
      {/* 認証済みの場合、ユーザー情報を表示 */}
      <Show when={authStatus === 'authenticated'}>
        <div>
          <h1>User</h1>
          <div>
            <p>Username: {user?.username}</p>
          </div>
        </div>
      </Show>
      <Show when={error}>
        <Alert variation="error">{error?.message}</Alert>
      </Show>

    </main>
  );
}

export default App;
