import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

const bucketName = 'emi-cdk-ci-cd-codepipeline-bucket';

export class CdkCiCdCodepipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //create a new S3
    new s3.Bucket(this, bucketName, {
      versioned: true,
      bucketName,
    });
  }
}
