##################################################################################
# VARIABLES
##################################################################################

variable "name" {
	type = string
	description = "Determines the name of resources created"
}

variable "lambda_source_filename" {
	type = string
	description = "Full path and source name to the lambda function source code packaged zip"
}

variable "apigatewayv2_api_execution_arn" {
	type = string
	description = "ARN of the AWS Api Gateway v2 to which to grant excute permssions to"
}

variable "tags" {
  description = "Map object of AWS tags to add to each AWS resouce created"
  type        = map(string)
  default     = {}
}
