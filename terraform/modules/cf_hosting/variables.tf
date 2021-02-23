##################################################################################
# VARIABLES
##################################################################################

variable "name" {
	type = string
}

variable "edge_lambda_qualified_arn" {
	type = string
}

variable "tags" {
  description = "Tags"
  type        = map(string)
  default     = {}
}
