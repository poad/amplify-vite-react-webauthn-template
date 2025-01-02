import { Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import useAuth from './hooks';
import { JSX } from 'react';
import { Show } from '../flow';

/**
 * SignOutButtonコンポーネント - AWS Amplifyを使用したサインアウトボタン
 *
 * ユーザーがサインインしている場合のみ表示され、クリック時にグローバルサインアウトを実行します。
 * サインアウト後、オプションのコールバックを実行します。
 *
 * @component
 * @param {Object} props
 * @param {() => void} [props.onSignOut] - サインアウト完了時に実行されるオプションのコールバック
 *
 * @example
 * ```tsx
 * <SignOutButton onSignOut={() => console.log('User signed out')} />
 * ```
 */
export function SignOutButton(props: { onSignOut?: () => void }): JSX.Element {
  const { isSignedIn, signOut } = useAuth();

  return (
    <Show when={isSignedIn} fallback={<></>}>
      <Button
        onClick={() => {
          signOut({ global: true });
          props.onSignOut?.();
        }}
      >
        Sign out
      </Button>
    </Show>
  );
}

export default SignOutButton;
