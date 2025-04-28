import * as cdk from 'aws-cdk-lib';
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './pipelineStage';

export class CdkCiCdCodepipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'cdk-emi-pipeline', {
      pipelineName: 'cdk-emi-pipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub(
          'EmiRoberti77/cdk-ci-cd-codepipeline',
          'main'
        ),
        commands: ['npm ci', 'npx cdk synth'],
      }),
    });

    const testStage = pipeline.addStage(
      new PipelineStage(this, 'EmiCdkPipelineTest', {
        stageName: 'test',
      })
    );

    testStage.addPre(
      new CodeBuildStep('unit-test', {
        commands: ['npm ci', 'npm run test'],
      })
    );
  }
}
