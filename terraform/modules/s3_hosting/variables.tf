##################################################################################
# VARIABLES
##################################################################################

variable "application_name" {
	type = string
	default = "nice-app"
}

variable "environment_name" {
	type = string
	default = "local"
}

variable "created_by" {
	type = string
	default = "terraform"
}

variable "teamcity_build_number" {
	type = string
	default = "xxx"
}

variable "edge_lambda_arn" {
	type = string
}

variable "edge_lambda_qualified_arn" {
	type = string
}
