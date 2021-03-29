##################################################################################
# VARIABLES
##################################################################################
variable "org_name" {
  description = "The org of application/project"
  	type = string
	default = "nice"
}

variable "application_name" {
  description = "The name of application/project"
  	type = string
	default = "cks"
}

variable "environment_name" {
  description = "The name of environment"
  	type = string
	default = "local"
}
variable "created_by" {
	description = "The name of the user or service that created the service or resouce"
	type = string
	default = "terraform"
}

variable "release_number" {
	type = string
}

variable "search_lambda_source_filename" {
	type = string
}

variable "origin_request_edge_lambda_source_filename" {
	type = string
}
variable "origin_response_edge_lambda_source_filename" {
	type = string
}
variable "viewer_request_edge_lambda_source_filename" {
	type = string
}

