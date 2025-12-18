# AWS CDK deployment

This repo contains:
- Frontend: Vite build output in `dist/`
- Backend: a Lambda Function URL at `infra/lambda/cv-request.js` for the `/cv` form

## Prereqs

- AWS CLI configured (`AWS_PROFILE`, `AWS_REGION`)
- AWS SES set up in the target region (verify sender identity and, if in SES sandbox, verify the recipient too)
- Cloudflare Turnstile keys (site key + secret)
- Route53 hosted zone for your domain in the same AWS account (this stack looks up `EXISTING_DOMAIN` and creates `aimeej.ca` + `www.aimeej.ca` records)

## Deploy

From the repo root:

1) Build the frontend:

`npm run build`

2) Create the Turnstile secret in SSM Parameter Store (SecureString, same region you deploy into):

`aws ssm put-parameter --name /aimeej/turnstile/secret --type SecureString --value "YOUR_TURNSTILE_SECRET_KEY" --overwrite`

3) Install infra deps and deploy:

`cd infra && npm install`

`npx cdk bootstrap`

`npx cdk deploy --parameters TurnstileSiteKey=YOUR_SITE_KEY --parameters TurnstileSecretSsmParameterName=/aimeej/turnstile/secret --parameters ToEmail=aimeejesso@gmail.com --parameters FromEmail=aimeejesso@gmail.com`

You also need the hosted zone id:

`aws route53 list-hosted-zones-by-name --dns-name aimeej.ca. --query 'HostedZones[0].Id' --output text`

Then include:

`--parameters HostedZoneId=Z123...`

After deploy, the stack uploads `dist/` and writes `runtime-config.json` (contains `apiUrl` + `turnstileSiteKey`) into the site bucket.
