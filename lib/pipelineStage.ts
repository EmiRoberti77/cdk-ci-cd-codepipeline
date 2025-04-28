import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaStack } from './lambdaStack';

/**
 * stages will hold other stacks from the pipeline
 */
export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    new LambdaStack(this, 'EmiCdkLambdaStack', {
      stageName: props.stageName,
    });
  }
}
