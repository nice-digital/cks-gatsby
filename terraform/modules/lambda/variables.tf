##################################################################################
# VARIABLES
##################################################################################

variable "name" {
	type = string
}

variable "lambda_source_filename" {
	type = string
}

variable "lambda_name" {
	type = string
	default = "nice-lambda"
}

variable "apigatewayv2_api_execution_arn" {
	type = string
}

variable "tags" {
  description = "Tags"
  type        = map(string)
  default     = {}
}
