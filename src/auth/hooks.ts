import React, { useEffect, useCallback } from 'react';
import {
  fetchAuthSession,
  AuthUser,
  getCurrentUser,
  FetchUserAttributesOutput,
  fetchUserAttributes,
} from 'aws-amplify/auth';
import { AuthEventData } from '@aws-amplify/ui';
import { useAuthenticator } from '@aws-amplify/ui-react';

/**
 * AWS Amplifyを使用した認証状態管理のカスタムフック
 *
 * 以下の機能を提供します：
 * - 認証ユーザー情報の取得と管理
 * - IDトークンの取得と管理
 * - ユーザー属性の取得と管理
 * - サインアウト機能
 * - 認証状態の確認
 * - 認証情報の再取得
 *
 * @returns {Object} 認証関連の状態と機能
 * @property {AuthUser} [user] - 現在のユーザー情報
 * @property {string} [token] - 現在のIDトークン
 * @property {FetchUserAttributesOutput} [attributes] - ユーザーの属性情報
 * @property {(data?: AuthEventData) => void} signOut - サインアウト関数
 * @property {boolean} isSignedIn - 認証状態を示すフラグ
 * @property {() => void} refetch - 認証情報を再取得する関数
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isSignedIn, signOut } = useAuth();
 *
 *   if (!isSignedIn) {
 *     return <div>Please sign in</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user?.username}</p>
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 */
const useAuth = (): {
  user?: AuthUser;
  token?: string;
  attributes?: FetchUserAttributesOutput;
  signOut: (data?: AuthEventData | undefined) => void;
  isSignedIn: boolean;
  refetch: () => void
} => {
  const [user, setUser] = React.useState<AuthUser | undefined>();
  const [token, setToken] = React.useState<string | undefined>(undefined);
  const [attributes, setAttributes] = React.useState<
    FetchUserAttributesOutput | undefined
  >();
  const {
    authStatus,
    signOut,
  } = useAuthenticator((context) => [
    context.authStatus,
    context.signOut,
  ]);

  /**
   * IDトークンを再取得する関数
   * ユーザーセッションが更新された場合などに使用
   */
  const refetch = useCallback(async () => {
    const { idToken } = (await fetchAuthSession()).tokens ?? {};
    setToken(idToken?.toString());
  }, []);

  /**
   * 認証情報を取得・更新する関数
   * トークン、ユーザー情報、ユーザー属性を取得し、状態を更新
   * エラー時は全ての認証情報をクリア
   */
  const handleAuth = async () => {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      setToken(idToken?.toString());

      await getCurrentUser().then((currentUser) => {
        setUser(currentUser);
        return currentUser;
      });

      void await fetchUserAttributes().then((attr) => {
        setAttributes(attr);
        return attr;
      });
    } catch {
      setToken(undefined);
      setUser(undefined);
      setAttributes(undefined);
    }
  };

  // コンポーネントマウント時に認証情報を取得 (ここだけは useEffect を使わざるを得ない)
  useEffect(() => {
    handleAuth();
  }, []);

  return {
    user,
    token,
    attributes,
    signOut,
    isSignedIn: authStatus === 'authenticated',
    refetch,
  };
};

export default useAuth;
