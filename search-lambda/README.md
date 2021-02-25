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

## Deployment

1. Make sure you have your aws credentials setup and correctly working before attempting to use terraform.
1. Make sure you have terraform setup and running on your machine (Linux and Windows both work fine) also making sure that its in your $path env variable
1. Change to terraform directory and run
