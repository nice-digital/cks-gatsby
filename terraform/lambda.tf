module "lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 1.0"

  function_name = "${random_pet.this.id}-cks-lambda-demo"
  description   = "Demo cks lambda function"
  handler       = "aws-cks-lambda-demo::aws_cks_lambda_demo.Function::GetUpperCaseHandler"
  runtime       = "dotnetcore3.1"
  publish       = true

  source_path = "../aws-cks-lambda-demo/aws-cks-lambda-demo/bin/Release/netcoreapp3.1/linux-x64"

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.this_apigatewayv2_api_execution_arn}/*/*"
    }
  }
}

module "lambda_alias" {
  source  = "terraform-aws-modules/lambda/aws//modules/alias"
  version = "~> 1.0"

  name = "prod"

  function_name = module.lambda.this_lambda_function_name

  # Set function_version when creating alias to be able to deploy using it,
  # because AWS CodeDeploy doesn't understand $LATEST as CurrentVersion.
  function_version = module.lambda.this_lambda_function_version
}
