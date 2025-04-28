import * as cdk from 'aws-cdk-lib';
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './pipelineStage';

const githubPath = 'EmiRoberti77/cdk-ci-cd-codepipeline';

export class CdkCiCdCodepipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1️⃣ DEV Pipeline
    this.buildPipeLine(
      'dev',
      githubPath,
      'dev',
      ['npm ci', 'npx cdk synth'],
      'devEmiCdkPipeline',
      ['npm ci', 'npm run test'],
      'emiStageCdkPipeline',
      'emiUnitTestPipeline',
      'devSynthShell'
    );
    // 2️⃣ UAT Pipeline
    const uatPipeline = new CodePipeline(this, 'UatPipeline', {
      pipelineName: 'cdk-emi-uat-pipeline',
      synth: new ShellStep('Synth-Uat', {
        input: CodePipelineSource.gitHub(
          'EmiRoberti77/cdk-ci-cd-codepipeline',
          'uat' // UAT branch
        ),
        commands: ['npm ci', 'npx cdk synth'],
      }),
    });
  }

  buildPipeLine(
    stageName: string,
    github: string,
    branch: string,
    buildCommands: string[],
    pipelineName: string,
    testCommands: string[],
    pipelineStageName: string,
    testPipeLineName: string,
    shellStep: string
  ) {
    const devPipeline = new CodePipeline(this, pipelineName, {
      pipelineName,
      synth: new ShellStep(shellStep, {
        input: CodePipelineSource.gitHub(github, branch),
        commands: buildCommands,
      }),
    });

    const devStage = devPipeline.addStage(
      new PipelineStage(this, pipelineStageName, {
        stageName,
      })
    );

    devStage.addPre(
      new CodeBuildStep(testPipeLineName, {
        commands: testCommands,
      })
    );
  }
}
