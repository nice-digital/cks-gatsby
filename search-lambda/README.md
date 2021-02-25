# Search endpoint for CKS

> .NET Core 3 web application for NICE Clinical Knowledge Summaries (CKS) to serve a search API endpoint using AWS Lambda and API Gateway

## Stack

- [Visual Studio 2019](https://visualstudio.microsoft.com/vs/)
- [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) - LTS which is support by AWS
- [xUnit](https://xunit.net/) for tests
- [AWS Toolkit for Visual Studio](https://aws.amazon.com/visualstudio/)
- [AWS .NET Mock Lambda Test Tool 3.1](https://github.com/aws/aws-lambda-dotnet/tree/master/Tools/LambdaTestTool)
- [AWS Command Line Interface](https://aws.amazon.com/cli/)
- [Terraform 0.14^](https://www.terraform.io/)
- [AWS VS Tools]()

## :rocket: Set up

### Running locally

It is possible to run, debug and deploy this locally in either WSL 2 or Windows. If you use Visual Studio a lot of these steps are done for you. However if you want use VS Code then the steps are as follows....

1. Install and configure .NET Core 3.1 SDK - this is the version of dotnet recommended and supported by AWS currently (Feb 2021)
1. Install and configure [AWS lambda tools] (https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/lambda-cli-publish.html)
1. Use

### Deployment to AWS using AWS and Terraform

1. Install and configure AWS CLI
1. Install Terraform
1. Make sure you set your credentials (in the form of a an access key and secret) using `aws configure` command (see main Terraform project for info on AWS credentials)
