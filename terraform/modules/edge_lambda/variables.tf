##################################################################################
# VARIABLES
##################################################################################

variable "name" {
	type = string
}

variable "event_type" {
	type = string
}

variable "lambda_source_filename" {
	type = string
}

variable "tags" {
  description = "Tags"
  type        = map(string)
  default     = {}
}
