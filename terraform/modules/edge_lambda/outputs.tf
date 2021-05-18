##################################################################################
# OUTPUT
##################################################################################

output this_lambda_arn {
	description = "The ARN of the lambda. Will be of format arn:aws:lambda:us-east-1::functionname"
	value = aws_lambda_function.edge_lambda.arn
}

output this_lambda_qualified_arn {
	description = "The qualified ARN of the lambda. Will be of format arn:aws:lambda:us-east-1::functionname:{#versionnumber}"
	value = aws_lambda_function.edge_lambda.qualified_arn
}
