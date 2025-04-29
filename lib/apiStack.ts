import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

const apiName = 'emiCdkCICDPipelineAPI-';
const rootPath = 'api';
const GET = 'GET';

interface ApiStackProps extends StackProps {
  task1Lambda: NodejsFunction;
  stageName: string;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    const apiGatewayName = apiName + props.stageName;
    const task1LambdaIntegration = new LambdaIntegration(props.task1Lambda);
    const api = new RestApi(this, apiGatewayName, {
      restApiName: apiGatewayName,
    });
    const apiResource = api.root.addResource(rootPath);
    apiResource.addMethod(GET, task1LambdaIntegration);
  }
}
