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
import { Switch, Match } from '../flow';
import './SignIn.css';

export function SignIn(props: {
  onSignedIn?: (signInResult: ConfirmSignInOutput) => void;
  onError?: (error: Error) => void
}): JSX.Element {

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<Error | undefined>();
  const [flow, setFlow] = useState('email');
  const [signResult, setSignResult] = useState<SignInOutput | undefined>();

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
        // present user with list of available challenges
        console.log(`Available Challenges: ${result.nextStep.availableChallenges}`);

        // respond with user selection using `confirmSignIn` API
        const { nextStep: nextConfirmSignInStep } = await confirmSignIn({
          challengeResponse: 'WEB_AUTHN', // or 'EMAIL_OTP', 'WEB_AUTHN', 'PASSWORD', 'PASSWORD_SRP'
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
        {
          error ? <Alert variation="error">{error.message}</Alert> : <></>
        }
      </Flex>
    </View>
  );
}

export default SignIn;
