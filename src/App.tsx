import { JSX } from 'react';
import { Auth } from './auth/Auth';
import '@aws-amplify/ui-react/styles.css';

/**
 * Appコンポーネントは、認証関連のUIを表示するためのメインコンポーネントです。
 *
 * @returns {JSX.Element} アプリケーションのメインUIにAuthコンポーネントを表示
 */
function App(): JSX.Element {

  return (
    <main>
      {/* 認証コンポーネントを表示 */}
      <Auth />
    </main>
  );
}

export default App;
