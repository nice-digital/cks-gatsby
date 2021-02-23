##################################################################################
# VARIABLES
##################################################################################

variable "name" {
	type = string
}

variable "lambda_source_filename" {
	type = string
}

# variable "lambda_name" {
# 	type = string
# 	default = "nice-edge-lambda"
# }

variable "tags" {
  description = "Tags"
  type        = map(string)
  default     = {}
}
