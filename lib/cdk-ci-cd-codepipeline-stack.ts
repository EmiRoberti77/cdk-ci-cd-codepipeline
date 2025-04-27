import * as cdk from 'aws-cdk-lib';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

export class CdkCiCdCodepipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, 'cdk-emi-pipeline', {
      pipelineName: 'cdk-emi-pipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub(
          'EmiRoberti77/cdk-ci-cd-codepipeline',
          'main'
        ),
        commands: ['npm ci', 'npx cdk synth'],
      }),
    });
  }
}
