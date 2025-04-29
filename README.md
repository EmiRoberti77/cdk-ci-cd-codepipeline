# CDK CI/CD Pipeline with GitHub, Lambda, API Gateway, and Unit Testing

This guide walks through how to set up a complete AWS CDK CI/CD pipeline that:

- Automatically deploys infrastructure on pushes to GitHub
- Builds a Lambda and an API Gateway for multiple environments
- Runs unit tests during deployment
- Uses GitHub OAuth tokens securely

## ✨ Overview of the Stack

This project consists of the following major components:

- **`LambdaStack`**: Creates a Lambda function.
- **`ApiStack`**: Creates an API Gateway integrated with the Lambda.
- **`PipelineStage`**: Bundles the Lambda and API into a stage (e.g., dev, prod).
- **`CdkCiCdCodepipelineStack`**: Creates a CodePipeline for CI/CD.
- **GitHub integration**: Uses GitHub OAuth to pull and deploy code.

---

## 🌎 CDK App Entry Point

File: `bin/cdk-ci-cd-codepipeline.ts`

```ts
#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkCiCdCodepipelineStack } from '../lib/cdk-ci-cd-codepipeline-stack';

const app = new cdk.App();
new CdkCiCdCodepipelineStack(app, 'CdkCiCdCodepipelineStack', {});
app.synth();
```

This file is the main entry point that bootstraps the CDK application.

---

## ⚖️ CodePipeline Stack

File: `cdk-ci-cd-codepipeline-stack.ts`

This file defines a CodePipeline that:

- Pulls code from GitHub (branch `dev`)
- Synthesizes the CDK app
- Runs unit tests before deploying to the Dev environment
- Uses `buildPipeLine` function to dynamically construct the pipeline.

```ts
this.buildPipeLine(
  'dev',
  'EmiRoberti77/cdk-ci-cd-codepipeline',
  'dev',
  ['npm ci', 'npx cdk synth'],
  'devEmiCdkPipeline',
  ['npm ci', 'npm run test'],
  'emiStageCdkPipeline',
  'emiUnitTestPipeline',
  'devSynthShell'
);
```

---

## ✅ Pipeline Builder Function

This function dynamically creates the pipeline with build and test phases:

```ts
const devPipeline = new CodePipeline(this, pipelineName, {
  pipelineName,
  synth: new ShellStep(shellStep, {
    input: CodePipelineSource.gitHub(github, branch),
    commands: buildCommands,
  }),
});

devStage.addPre(
  new CodeBuildStep(testPipeLineName, { commands: testCommands })
);
```

The `synth` step runs `cdk synth`, and the `pre` step runs unit tests.

---

## 🛠 PipelineStage

File: `pipelineStage.ts`

The `PipelineStage` class contains two sub-stacks:

- **`LambdaStack`**
- **`ApiStack`**

The Lambda stack is created first, and its output (a Lambda function) is passed to the API Gateway stack.

```ts
const lambdaStack = new LambdaStack(...);
new ApiStack(this, apiStackName + props.stageName, {
  task1Lambda: lambdaStack.task1Lambda,
  stageName: props.stageName!,
});
```

---

## 🚀 LambdaStack

Creates a Lambda function using Node.js runtime:

```ts
this.task1Lambda = new NodejsFunction(this, task1LambdaName, {
  runtime: Runtime.NODEJS_LATEST,
  handler: 'handler',
  entry: task1LambdaPath,
  environment: {
    STAGE: props.stageName!,
  },
});
```

IAM permissions are added with a permissive policy (adjust this for production environments).

---

## 🌐 ApiStack

Defines a REST API Gateway that integrates with the Lambda function and sets the deployment stage name dynamically:

```ts
const api = new RestApi(this, apiGatewayName, {
  restApiName: apiGatewayName,
  deployOptions: {
    stageName: props.stageName,
  },
});

api.root.addResource('api').addMethod('GET', task1LambdaIntegration);
```

---

## 🧪 Unit Testing with CodeBuild

Unit tests are executed as part of the pipeline in a `CodeBuildStep`:

```ts
devStage.addPre(
  new CodeBuildStep('emiUnitTestPipeline', {
    commands: ['npm ci', 'npm run test'],
  })
);
```

Tests should be defined in your source repo under a `test` or `__tests__` folder.

Example `package.json`:

```json
"scripts": {
  "test": "jest"
}
```

---

## 🔐 GitHub Token for Source Authentication

To access GitHub repositories, CodePipeline needs OAuth authentication.

You can create a GitHub token and store it in AWS Secrets Manager, or use the default GitHub app connection via `CodePipelineSource.gitHub()`.

Example:

```ts
CodePipelineSource.gitHub('EmiRoberti77/cdk-ci-cd-codepipeline', 'dev');
```

If necessary, GitHub tokens can be injected into CodeBuild environments using Secrets Manager.

---

## 🏗 Extending to UAT and PROD

To extend the project to UAT and PROD pipelines:

1. Create more branches (`uat`, `prod`) in GitHub.
2. Call `buildPipeLine()` multiple times for different stages.

Example:

```ts
this.buildPipeLine('uat', githubPath, 'uat', [...], 'uatPipeline', [...], 'uatStage', 'uatTest', 'uatSynth');
this.buildPipeLine('prod', githubPath, 'main', [...], 'prodPipeline', [...], 'prodStage', 'prodTest', 'prodSynth');
```

You can even add manual approval steps between environments for more control.

---

## 📋 Final Summary

| Component     | Purpose                       |
| ------------- | ----------------------------- |
| CodePipeline  | CI/CD orchestration           |
| ShellStep     | Synthesizes CDK app           |
| CodeBuildStep | Executes unit tests           |
| PipelineStage | Bundles Lambda and API stacks |
| LambdaStack   | Deploys Node.js Lambda        |
| ApiStack      | Deploys API Gateway           |
| GitHub OAuth  | Secure source code access     |

This architecture ensures that every code change is tested, built, and deployed automatically across environments, providing a robust and scalable CI/CD system.

---

_Written by [EmiRoberti77](https://github.com/EmiRoberti77)_ 🚀
