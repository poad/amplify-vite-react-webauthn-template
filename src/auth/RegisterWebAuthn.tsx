import { associateWebAuthnCredential } from 'aws-amplify/auth';
import { useState } from 'react';
import { Show } from '../flow';
import { Alert, Button } from '@aws-amplify/ui-react';

/**
* PassKey (WebAuthn)を登録するためのコンポーネント
*
* WebAuthn認証情報をユーザーのAWS Cognitoアカウントに関連付けます。
* 登録に成功すると、ユーザーは次回以降PassKeyを使用してサインインできます。
*
* が！ Cognito の設定とデプロイ先のフロントエンドの設定が合わないため、ドメインが異なるような内容のエラーが発生して期待通りには動作していません！
*
* @component
* @example
* ```tsx
* <RegisterWebAuthn />
* ```
*/
export function RegisterWebAuthn() {
  // エラー状態の管理
  const [error, setError] = useState<{ message?: string } | undefined>();

  /**
   * PassKey登録プロセスを開始
   * 失敗した場合はエラーメッセージを表示
   */
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
      <Button onClick={registerPassKey}>Register PassKey</Button>
      <Show when={error}>
        <Alert variation="error">{error?.message}</Alert>
      </Show>
    </>
  );
}
