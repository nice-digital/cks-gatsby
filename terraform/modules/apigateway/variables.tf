##################################################################################
# VARIABLES
##################################################################################

variable "name" {
	type = string
}

variable "lambda_invoke_arn" {
	type = string
}

variable "tags" {
  description = "Tags"
  type        = map(string)
  default     = {}
}
