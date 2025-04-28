import { Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as path from 'path';

interface LambdaStackProps extends StackProps {
  stageName?: string;
}

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const task1LambdaPath = path.join(
      __dirname,
      '..',
      'src',
      'lambdas',
      'task1Lambda',
      'handler.ts'
    );

    const task1Lambda = new NodejsFunction(this, 'task1Lambda', {
      runtime: Runtime.NODEJS_LATEST,
      handler: 'handler',
      functionName: 'task1Lambda',
      entry: task1LambdaPath,
      environment: {
        STAGE: props.stageName!,
      },
    });
  }
}
