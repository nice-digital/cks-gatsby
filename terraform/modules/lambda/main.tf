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
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "dotnet_lambda" {
  filename      = var.lambda_source_filename
  function_name = local.lambda_name
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "CKS.SearchLambda::CKS.SearchLambda.Function::FunctionHandler"
  runtime       = "dotnetcore3.1"

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
#   source_code_hash = filebase64sha256("lambda_function_payload.zip")



}
