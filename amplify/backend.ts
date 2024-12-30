import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { CfnUserPoolDomain } from 'aws-cdk-lib/aws-cognito';

const backend = defineBackend({
  auth,
});

const { cfnUserPool, cfnUserPoolClient } = backend.auth.resources.cfnResources;
cfnUserPool.addPropertyOverride('Policies.SignInPolicy', {
  AllowedFirstAuthFactors: ['PASSWORD', 'EMAIL_OTP', 'WEB_AUTHN'],
});
new CfnUserPoolDomain(backend.stack, 'Domain', {
  userPoolId: cfnUserPool.attrUserPoolId,
  domain: 'amplify-webauthn-example',
});

cfnUserPoolClient.explicitAuthFlows = ['ALLOW_USER_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH'];
