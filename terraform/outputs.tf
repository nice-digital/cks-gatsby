###############
# API Gateway
###############
output "this_apigatewayv2_api_id" {
  description = "The API identifier"
  value       = module.api_gateway.this_apigatewayv2_api_id
}

output "this_apigatewayv2_api_api_endpoint" {
  description = "The URI of the API"
  value       = module.api_gateway.this_apigatewayv2_api_api_endpoint
}

output "this_apigatewayv2_api_arn" {
  description = "The ARN of the API"
  value       = module.api_gateway.this_apigatewayv2_api_arn
}

output "this_apigatewayv2_api_execution_arn" {
  description = "The ARN prefix to be used in an aws_lambda_permission's source_arn attribute or in an aws_iam_policy to authorize access to the @connections API."
  value       = module.api_gateway.this_apigatewayv2_api_execution_arn
}

output "default_apigatewayv2_stage_execution_arn" {
  description = "The ARN prefix to be used in an aws_lambda_permission's source_arn attribute or in an aws_iam_policy to authorize access to the @connections API."
  value       = module.api_gateway.default_apigatewayv2_stage_execution_arn
}
