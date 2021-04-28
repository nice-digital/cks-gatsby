  ##################################################################################
  # OUTPUT
  ##################################################################################


output "this_apigatewayv2_api_execution_arn" {
  description = "The ARN prefix to be used in an aws_lambda_permission's source_arn attribute or in an aws_iam_policy to authorize access to the @connections API."
  value       = aws_apigatewayv2_api.lambda_api.execution_arn
}

output "this_apigatewayv2_domain_name" {
  description = "The target domain name."
  value       = aws_apigatewayv2_api.lambda_api.api_endpoint
}
