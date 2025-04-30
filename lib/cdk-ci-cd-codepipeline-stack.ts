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
const enum STAGE {
  DEV = 'dev',
  UAT = 'uat',
  PROD = 'prod',
}

const enum BRANCH {
  DEV = 'dev',
  UAT = 'uat',
  MAIN = 'main',
}

export class CdkCiCdCodepipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DEV Pipeline
    this.buildPipeLine(
      STAGE.DEV,
      githubPath,
      BRANCH.DEV,
      ['npm ci', 'npx cdk synth'],
      'devEmiCdkPipeline',
      ['npm ci', 'npm run test'],
      'devStageCdkPipeline',
      'devUnitTestPipeline',
      'devSynthShell'
    );

    // PROD Pipeline
    this.buildPipeLine(
      STAGE.PROD,
      githubPath,
      BRANCH.MAIN,
      ['npm ci', 'npx cdk synth'],
      'prodEmiCdkPipeline',
      ['npm ci', 'npm run test'],
      'prodStageCdkPipeline',
      'prodUnitTestPipeline',
      'prodSynthShell'
    );
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
