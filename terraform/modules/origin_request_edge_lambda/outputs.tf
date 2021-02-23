##################################################################################
# OUTPUT
##################################################################################

output this_lambda_arn {
	description = "The arn of the lambda"
	value = aws_lambda_function.origin_request_edge_lambda.arn
}

output this_lambda_qualified_arn {
	description = "The qualified arn of the lambda"
	value = aws_lambda_function.origin_request_edge_lambda.qualified_arn
}
