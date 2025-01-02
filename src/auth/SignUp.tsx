import { View, Flex, Label, Input, Button, Text, Alert } from '@aws-amplify/ui-react';
import { confirmSignUp, signUp } from 'aws-amplify/auth';
import { JSX, useState } from 'react';
import { Match, Show, Switch } from '../flow';

/**
 * SignUpコンポーネント - AWS Amplifyを使用したユーザー登録フォーム
 *
 * このコンポーネントは2段階の登録プロセスを提供します：
 * 1. メールアドレスの入力
 * 2. 確認コードの入力による登録の完了
 *
 * @component
 * @param {Object} props
 * @param {() => void} props.onSignedUp - サインアップが正常に完了した時に呼び出されるコールバック
 * @param {(error: Error) => void} [props.onError] - エラー発生時に呼び出されるオプションのコールバック
 *
 * @example
 * ```tsx
 * <SignUp
 *   onSignedUp={() => console.log('Signup completed')}
 *   onError={(error) => console.error('Signup error:', error)}
 * />
 * ```
 */
export function SignUp(props: {
  onSignedUp: () => void;
  onError?: (error: Error) => void;
}): JSX.Element {
  // フォームの状態管理
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<Error | undefined>();
  const [signUpNextStep, setSignUpNextStep] = useState<string | undefined>();

  /**
   * メールアドレス入力後の次のステップへの進行を処理
   * バリデーションを行い、AWS Amplifyのsignup処理を実行
   */
  async function handleClickNext() {
    try {
      if (email.length === 0) {
        setError(new Error('Email is must not be empty.'));
        return;
      }
      setError(undefined);

      const { nextStep } = await signUp({
        username: email,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      setSignUpNextStep(nextStep.signUpStep);
    } catch (e) {
      setError(e as Error);
      props.onError?.(e as Error);
    }
  }

  /**
   * 確認コードを使用したサインアップの完了処理
   * 確認コードのバリデーションを行い、AWS Amplifyの確認処理を実行
   */
  async function handleClickSignUp() {
    if (code.length === 0) {
      setError(new Error('Confirmation Code is must not be empty.'));
      return;
    }
    setError(undefined);

    try {
      const { nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      setError(undefined);
      if (signUpNextStep === 'DONE') {
        props.onSignedUp();
      }
      setSignUpNextStep(nextStep.signUpStep);
    } catch (e) {
      setError(e as Error);
      props.onError?.(e as Error);
    }
  }

  // サインアップ完了時の成功メッセージ表示
  if (signUpNextStep === 'DONE') {
    return <Alert variation="success">Success</Alert>;
  }

  return (
    <View>
      <Flex direction="column" gap="small">
        <Switch fallback={
          <>
            <Label htmlFor="code" className="pr-1">
              Confirmation Code
              <Text as="span" fontSize="small" color="font.error">
                {' '}
                (required)
              </Text>
            </Label>
            <Input
              id="code"
              type="text"
              value={code}
              onInput={(e) => setCode(e.currentTarget.value)}
              isRequired
            />
            <Button
              onClick={handleClickSignUp}
            >
              Create Account
            </Button>
          </>
        }>
          <Match when={signUpNextStep === 'DONE'}>
            <Alert variation="success">Success</Alert>
          </Match>
          <Match when={signUpNextStep !== 'CONFIRM_SIGN_UP'}>
            <>
              <Label htmlFor="email" className="pr-1">
                Email
                <Text as="span" fontSize="small" color="font.error">
                  {' '}
                  (required)
                </Text>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                isRequired
              />
              <Button
                onClick={handleClickNext}
              >
                Next
              </Button>
            </>
          </Match>
        </Switch>

        <Show when={error}>
          <Alert variation="error">{error?.message}</Alert>
        </Show>
      </Flex>
    </View>
  );
}
