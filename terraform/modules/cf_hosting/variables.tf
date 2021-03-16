##################################################################################
# VARIABLES
##################################################################################

variable "name" {
	type = string
}

variable "origin_request_edge_lambda_qualified_arn" {
	type = string
}

variable "origin_repsonse_edge_lambda_qualified_arn" {
	type = string
}

# variable "viewer_request_edge_lambda_qualified_arn" {
# 	type = string
# }

variable "tags" {
  description = "Tags"
  type        = map(string)
  default     = {}
}
