import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaStack } from './lambdaStack';
import { ApiStack } from './apiStack';

const lambdaStackName = 'EmiCdkLambdaStack-';
const apiStackName = 'EmiCdkApiStack-';
/**
 * stages will hold other stacks from the pipeline
 */
export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    //create the lambda and pass the stageName
    const lambdaStack = new LambdaStack(
      this,
      lambdaStackName + props.stageName,
      {
        stageName: props.stageName,
      }
    );

    //create the api and pass the stageName
    new ApiStack(this, apiStackName + props.stageName, {
      task1Lambda: lambdaStack.task1Lambda,
      stageName: props.stageName!,
    });
  }
}
