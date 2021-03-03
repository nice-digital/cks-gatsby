variable "org_name" {
  description = "The org of application/project"
  	type = string
	default = "nice"
}

variable "application_name" {
  description = "The name of application/project"
  	type = string
}

variable "environment_name" {
  description = "The name of environment"
  	type = string
}
variable "created_by" {
	description = "The name of the user or service that created the service or resouce"
	type = string
	default = "terraform"
}
