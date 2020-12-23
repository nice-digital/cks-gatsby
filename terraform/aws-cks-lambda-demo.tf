##################################################################################
# VARIABLES
##################################################################################

variable "region" {
  default = "eu-west-2"
}

##################################################################################
# PROVIDERS
##################################################################################

provider "aws" {
    region  = var.region
}

##################################################################################
# MODULES
##################################################################################

module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "aws-cks-lambda-demo"
  description   = "Demo cks lambda function"
  handler       = "aws-cks-lambda-demo::aws_cks_lambda_demo.Function::FunctionHandler"
  runtime       = "dotnetcore3.1"

  source_path = "../aws-cks-lambda-demo/aws-cks-lambda-demo/bin/Release/netcoreapp3.1/linux-x64"

  tags = {
    Name = "work",
	Work = "work"
  }
}
