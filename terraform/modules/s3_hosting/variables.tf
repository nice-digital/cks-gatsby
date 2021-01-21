variable "application_name" {
	type = string
}

variable "environment_name" {
	type = string
}

variable "created_by" {
	type = string
	default = "terraform"
}

variable "teamcity_build_number" {
	type = string
	default = "xxx"
}
