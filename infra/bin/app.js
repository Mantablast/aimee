#!/usr/bin/env node

const cdk = require("aws-cdk-lib");
const { AimeeStack } = require("../lib/aimee-stack");

const app = new cdk.App();

new AimeeStack(app, "AimeeStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

