##################################################################################
# Locals
##################################################################################

locals {
	api_gateway_name = "${var.application_name}-${var.api_name}-${var.environment_name}"
}

##################################################################################
# Resources
##################################################################################

resource "aws_apigatewayv2_api" "lambda_api" {
  name          = local.api_gateway_name
  protocol_type = "HTTP"

}


resource "aws_apigatewayv2_integration" "lambda_api_integration" {
  api_id           = aws_apigatewayv2_api.lambda_api.id
  integration_type = "AWS_PROXY"
  payload_format_version = "2.0"

  connection_type           = "INTERNET"
  integration_method        = "POST"
  integration_uri           = var.lambda_invoke_arn
  passthrough_behavior      = "WHEN_NO_MATCH"
  timeout_milliseconds		= 30000
}

resource "aws_apigatewayv2_route" "lambda_api_index_route" {
  api_id    = aws_apigatewayv2_api.lambda_api.id
  route_key = "GET /"
  target 	= "integrations/${aws_apigatewayv2_integration.lambda_api_integration.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_route.lambda_api_index_route.api_id
  name        = "$default"
  auto_deploy = true

}
