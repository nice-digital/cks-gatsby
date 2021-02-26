##################################################################################
# Resources
##################################################################################

resource "aws_lambda_function" "dotnet_lambda" {
  function_name = "${var.name}-dotnet-lambda"
  filename      = var.lambda_source_filename
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "CKS.SearchLambda::CKS.SearchLambda.Function::FunctionHandler"
  runtime       = "dotnetcore3.1"
  timeout 		= 20

  source_code_hash = filebase64sha256(var.lambda_source_filename)

  tags = var.tags
}


resource "aws_iam_role" "iam_for_lambda" {
  name = "${var.name}-dotnet-lambda-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": ["lambda.amazonaws.com", "apigateway.amazonaws.com"]
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_permission" "api_gateway_execute" {
	action        = "lambda:InvokeFunction"
	function_name = aws_lambda_function.dotnet_lambda.arn
	principal     = "apigateway.amazonaws.com"

	source_arn = "${var.apigatewayv2_api_execution_arn}/*/*"
}
