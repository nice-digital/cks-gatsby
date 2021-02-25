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

variable "teamcity_build_number" {
  description = "The TeamCity build number of the build that triggered the creation of this resource"
  type = string
  default = "xxx"
}

variable "search_lambda_source_filename" {
	type = string
	default = "../CKS.SearchLambda.zip"
}

variable "edge_lambda_source_filename" {
	type = string
	default = "../CKS.EdgeLambda.zip"
}

variable "edge_lambda_source_filename" {
	type = string
}
