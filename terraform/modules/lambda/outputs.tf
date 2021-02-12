  ##################################################################################
  # OUTPUT
  ##################################################################################

output this_lambda_id {
	description = "The name of the lambda"
	value = aws_lambda_function.dotnet_lambda.id
}

output this_lambda_arn {
	description = "The arn of the lambda"
	value = aws_lambda_function.dotnet_lambda.arn
}

output this_lambda_invoke_arn {
	description = "The arn to invoke the lambda from apigateway"
	value = aws_lambda_function.dotnet_lambda.invoke_arn
}
