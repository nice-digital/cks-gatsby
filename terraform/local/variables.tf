##################################################################################
# VARIABLES
##################################################################################
variable "org_name" {
  	description = "The org of application/project. This is needed to correctly and uniquely identify some AWS resources which cannot have duplicate names as other global AWS recourses"
  	type = string
	default = "nice"
}

variable "application_name" {
  	description = "The name of application/project"
  	type = string
	default = "cks"
}

variable "environment_name" {
  	description = "The name of NICE environment. Local = local dev laptop, dev = dev environment in AWS, test = test environment in AWS, alpha = alpha environment in AWS etc..."
  	type = string
	default = "local"
}
variable "created_by" {
	description = "The name of the user or service that created the service or resource. This is to easily identify resources that have been created using Terraform an therefore should not be modified manually"
	type = string
	default = "terraform"
}

variable "release_number" {
	description = "Supplied manually or via Teamcity variables"
	type = string
}

variable "search_lambda_source_filename" {
	description = "Supplied manually or via Teamcity variables"
	type = string
}

variable "origin_request_edge_lambda_source_filename" {
	description = "Supplied manually or via Teamcity variables"
	type = string
}
variable "origin_response_edge_lambda_source_filename" {
	description = "Supplied manually or via Teamcity variables"
	type = string
}
variable "viewer_request_edge_lambda_source_filename" {
	description = "Supplied manually or via Teamcity variables"
	type = string
}

