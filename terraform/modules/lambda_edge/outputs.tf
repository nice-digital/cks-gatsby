  ##################################################################################
  # OUTPUT
  ##################################################################################

# output this_lambda_id {
# 	description = "The name of the lambda"
# 	value = aws_lambda_function.dotnet_lambda.id
# }

output this_lambda_arn {
	description = "The arn of the lambda"
	value = aws_lambda_function.edge_lambda.arn
}

output this_lambda_qualified_arn {
	description = "The qualified arn of the lambda"
	value = aws_lambda_function.edge_lambda.qualified_arn
}
