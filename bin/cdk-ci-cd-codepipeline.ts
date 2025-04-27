#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkCiCdCodepipelineStack } from '../lib/cdk-ci-cd-codepipeline-stack';

const app = new cdk.App();
new CdkCiCdCodepipelineStack(app, 'CdkCiCdCodepipelineStack', {});
app.synth();
