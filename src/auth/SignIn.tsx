import {
  View,
  Button,
  Flex,
  Input,
  Label,
  Text,
  Alert,
  RadioGroupField,
  Radio,
} from '@aws-amplify/ui-react';
import { confirmSignIn, ConfirmSignInOutput, signIn, SignInOutput } from 'aws-amplify/auth';
import { JSX, useState } from 'react';
import { Switch, Match, Show } from '../flow';
import './SignIn.css';

/**
 * SignInコンポーネント - AWS Amplifyを使用したユーザー認証フォーム
 *
 * このコンポーネントは以下の認証方式をサポートします：
 * 1. Email OTP認証 - ワンタイムパスワードをメールで受け取って認証
 * 2. PassKey認証 - WebAuthnを使用した生体認証やデバイス認証
 *
 * 認証フローの手順：
 * 1. ユーザーがメールアドレスを入力し認証方式を選択
 * 2. 選択した認証方式に応じた認証処理を実行
 * 3. 認証成功時にコールバックを実行
 *
 * @component
 * @param {Object} props
 * @param {(signInResult: ConfirmSignInOutput) => void} [props.onSignedIn] - サインイン成功時に呼び出されるコールバック
 * @param {(error: Error) => void} [props.onError] - エラー発生時に呼び出されるコールバック
 *
 * @example
 * ```tsx
 * <SignIn
 *   onSignedIn={(result) => console.log('Sign in completed:', result)}
 *   onError={(error) => console.error('Sign in error:', error)}
 * />
 * ```
 */
export function SignIn(props: {
  onSignedIn?: (signInResult: ConfirmSignInOutput) => void;
  onError?: (error: Error) => void
}): JSX.Element {
  // フォームの状態管理
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<Error | undefined>();
  const [flow, setFlow] = useState('email');  // 認証フローの種類（'email' または 'passkey'）
  const [signResult, setSignResult] = useState<SignInOutput | undefined>();

  /**
   * メールアドレス入力後の認証開始処理
   * 選択された認証方式に応じて適切な認証フローを開始します
   *
   * - Email OTPの場合：メール送信を実行
   * - PassKeyの場合：WebAuthn認証を開始
   */
  async function handleClickNext() {
    if (email.length === 0) {
      return;
    }
    setEmail('');
    setOtp('');
    setError(undefined);

    try {
      const result = await signIn({
        username: email,
        options: {
          authFlowType: 'USER_AUTH',
          preferredChallenge: flow === 'email' ? 'EMAIL_OTP' : 'WEB_AUTHN',
        },
      });
      setSignResult(result);

      if (
        result.nextStep.signInStep === 'CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION'
      ) {
        // 利用可能な認証方式の一覧を表示
        console.log(`Available Challenges: ${result.nextStep.availableChallenges}`);

        // ユーザーの選択に基づいて認証を続行
        const { nextStep: nextConfirmSignInStep } = await confirmSignIn({
          challengeResponse: 'WEB_AUTHN', // 'EMAIL_OTP', 'WEB_AUTHN', 'PASSWORD', 'PASSWORD_SRP' から選択
        });
        if (nextConfirmSignInStep.signInStep === 'DONE') {
          setError(undefined);
          props.onSignedIn?.(result);
        }
      }
    } catch (e: unknown) {
      setError(e as Error);
      props.onError?.(e as Error);
    }
  }

  /**
   * OTPコードを使用したサインイン完了処理
   * Email OTP認証フローでのみ使用され、
   * 入力されたOTPコードの検証を行います
   */
  async function handleClickSignIn() {
    const input = otp;
    if (input.length === 0) {
      setError(() => new Error('Confirmation Code is must not be empty.'));
      return;
    }

    setOtp('');
    setError(undefined);

    try {
      const result = await confirmSignIn({
        challengeResponse: input,
      });
      setSignResult(result);
      if (result.nextStep.signInStep === 'DONE') {
        props.onSignedIn?.(result);
      }
    } catch (e) {
      setError(e as Error);
      props.onError?.(e as Error);
    }
  }

  return (
    <View>
      <Flex direction="column" gap="small">
        <Switch fallback={
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
              onInput={(e) => setEmail(e.currentTarget.value)}
              isRequired
            />
            <RadioGroupField
              legend="Auth Type"
              name="type"
              direction="row"
              value={flow}
              onChange={(e) => setFlow(e.target.value)}
            >
              <Radio value="email">Email</Radio>
              <Radio value="passkey">PassKey</Radio>

            </RadioGroupField>
            <Button
              onClick={handleClickNext}
            >
              Next
            </Button>
          </>
        }>
          <Match when={signResult?.nextStep.signInStep === 'DONE'}>
            <></>
          </Match>
          <Match when={signResult?.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE'}>
            <>
              <Label htmlFor="otp" className="pr-1">
                One Time Password
                <Text as="span" fontSize="small" color="font.error">
                  {' '}
                  (required)
                </Text>
              </Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onInput={(e) => setOtp(e.currentTarget.value)}
                isRequired
              />
              <Button
                onClick={handleClickSignIn}
              >
                Sign In
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

export default SignIn;
