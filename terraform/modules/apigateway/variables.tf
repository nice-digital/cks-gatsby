##################################################################################
# VARIABLES
##################################################################################

variable "name" {
	type = string
	description = "Determines the name of resources created"
}

variable "lambda_invoke_arn" {
	type = string
	description = "The ARN of the lambda function that you want to invoke from this apigateway"
}

variable "tags" {
  description = "Map object of AWS tags to add to each AWS resouce created"
  type        = map(string)
  default     = {}
}
