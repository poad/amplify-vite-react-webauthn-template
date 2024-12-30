import {
  View,
  Button,
  Flex,
  Input,
  Label,
  Text,
  Alert,
} from '@aws-amplify/ui-react';
import { confirmSignIn, ConfirmSignInOutput, signIn, SignInOutput } from 'aws-amplify/auth';
import { JSX, useState } from 'react';
import './SignIn.css';

export function SignIn(props: {
  onSignedIn?: (signInResult: ConfirmSignInOutput) => void;
  onError?: (error: Error) => void
}): JSX.Element {

  const [username, setUsername] = useState('');
  const [error, setError] = useState<Error | undefined>();
  const [signResult, setSignResult] = useState<SignInOutput | undefined>();

  async function handleClick() {
    if (username.length === 0) {
      return;
    }
    setUsername('');

    try {
      const result = await signIn({
        username,
        options: {
          authFlowType: 'USER_AUTH',
          preferredChallenge: 'WEB_AUTHN',
        },
      });
      console.log(result.nextStep.signInStep);
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
      } else if (result.nextStep.signInStep === 'DONE') {
        setError(undefined);
        props.onSignedIn?.(result);
      }
    } catch (e: unknown) {
      setError(e as Error);
      props.onError?.(e as Error);
    }
  }

  return (
    <View>
      <Flex direction="column" gap="small">
        {
          signResult?.nextStep.signInStep === 'CONTINUE_SIGN_IN_WITH_FIRST_FACTOR_SELECTION' ?
            (
              <>

              </>
            ) :
            (
              <>
                <Label htmlFor="username" className="pr-1">
                  Email
                  <Text as="span" fontSize="small" color="font.error">
                    {' '}
                    (required)
                  </Text>
                </Label>
                <Input
                  id="username"
                  type="email"
                  value={username}
                  onInput={(e) => setUsername(e.currentTarget.value)}
                  isRequired
                />
                <Button
                  onClick={handleClick}
                >
                  Sign in
                </Button>
              </>
            )
        }
        {
          error ? <Alert variation="error">{error.message}</Alert> : <></>
        }
      </Flex>
    </View>
  );
}

export default SignIn;
