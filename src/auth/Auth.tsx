import { useState } from 'react';
import { SignOutButton } from './SignOutButton';
import { Tabs, Card, Flex, useAuthenticator } from '@aws-amplify/ui-react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { Show } from '../flow';
import { RegisterWebAuthn } from './RegisterWebAuthn';

/**
 * Authコンポーネント - AWS Amplifyを使用した認証UI
 *
 * 認証状態に応じて以下の機能を提供します：
 * - 未認証時：サインインとサインアップのタブ付きフォーム
 * - 認証済み時：サインアウトボタンとWebAuthn（PassKey）登録機能
 *
 * すべての認証フローをカプセル化し、アプリケーションの認証UIとして機能します。
 * タブベースのインターフェースにより、ユーザーは簡単にサインインとサインアップを
 * 切り替えることができます。
 *
 * @component
 *
 * @example
 * ```tsx
 * <Auth />
 * ```
 */
export function Auth() {
  const {
    authStatus,
  } = useAuthenticator((context) => [
    context.authStatus,
  ]);
  const [tab, setTab] = useState('signin');

  return (
    <Show when={authStatus !== 'authenticated'} fallback={
      <Flex direction="column" gap="small">
        <SignOutButton />
        <RegisterWebAuthn />
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
