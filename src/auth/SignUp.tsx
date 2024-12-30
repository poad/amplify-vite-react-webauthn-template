import { View, Flex, Label, Input, Button, Text, Alert } from '@aws-amplify/ui-react';
import { confirmSignUp, signUp } from 'aws-amplify/auth';
import { JSX, useState } from 'react';

export function SignUp(props: {
  onSignedUp: () => void;
  onError?: (error: Error) => void;
}): JSX.Element {

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<Error | undefined>();
  const [signUpNextStep, setSignUpNextStep] = useState<string | undefined>();


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

  if (signUpNextStep === 'DONE') {
    return <Alert variation="success">Success</Alert>;
  }

  return (
    <View>
      <Flex direction="column" gap="small">
        {
          signUpNextStep !== 'CONFIRM_SIGN_UP' ? (
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
          ) : (
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
          )
        }

        {
          error ? <Alert variation="error">{error.message}</Alert> : <></>
        }
      </Flex>
    </View>
  );
}
