import { JSX } from 'react';
import { Show } from './flow';
import { Auth } from './auth/Auth';
import useAuth from './auth/hooks';

import '@aws-amplify/ui-react/styles.css';

/**
 * Appコンポーネントは、認証関連のUIを表示するためのメインコンポーネントです。
 *
 * @returns {JSX.Element} アプリケーションのメインUIにAuthコンポーネントを表示
 */
function App(): JSX.Element {
  const { user, isSignedIn } = useAuth();

  return (
    <><main>
      {/* 認証コンポーネントを表示 */}
      <Auth />
      <Show when={isSignedIn}>
        <div>
          <h1>User</h1>
          <div>
            <p>Username: {user?.username}</p>
          </div>
        </div>
      </Show>
    </main >
    </>
  );
}

export default App;
