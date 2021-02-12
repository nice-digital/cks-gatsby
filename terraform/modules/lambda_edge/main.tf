##################################################################################
# Provider
##################################################################################

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

##################################################################################
# Locals
##################################################################################

locals {
	lambda_name = "${var.application_name}-${var.lambda_name}-${var.environment_name}"
}

##################################################################################
# Resources
##################################################################################

resource "aws_iam_role" "iam_for_lambda" {
  name = "iam-${local.lambda_name}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": ["lambda.amazonaws.com", "edgelambda.amazonaws.com"]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "edge_lambda" {
  filename      = var.lambda_source_filename
  function_name = local.lambda_name
  role          = aws_iam_role.iam_for_lambda.arn
  handler 		= "exports.handler"
  runtime 		= "nodejs12.x"
  publish 		= true

  provider = aws.us_east_1

  source_code_hash = filebase64sha256(var.lambda_source_filename)
}

# resource "aws_lambda_permission" "api_gateway_execute" {
# 	action        = "lambda:InvokeFunction"
# 	function_name = aws_lambda_function.dotnet_lambda.arn
# 	principal     = "apigateway.amazonaws.com"

# 	source_arn = "${var.apigatewayv2_api_execution_arn}/*/*"
# }
