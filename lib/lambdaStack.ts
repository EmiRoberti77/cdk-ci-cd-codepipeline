import { Stack, StackProps } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';

interface LambdaStackProps extends StackProps {
  stageName?: string;
}

export class LambdaStack extends Stack {
  task1Lambda: NodejsFunction;
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    //set the stage to the lambda name
    const task1LambdaName = 'task1Lambda-' + props.stageName;

    const task1LambdaPath = path.join(
      __dirname,
      '..',
      'src',
      'lambdas',
      'task1Lambda',
      'handler.ts'
    );

    this.task1Lambda = new NodejsFunction(this, task1LambdaName, {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'handler',
      functionName: task1LambdaName,
      entry: task1LambdaPath,
      environment: {
        STAGE: props.stageName!,
      },
    });

    this.task1Lambda.addToRolePolicy(
      new PolicyStatement({
        actions: ['*'],
        resources: ['*'],
        effect: Effect.ALLOW,
      })
    );
  }
}
