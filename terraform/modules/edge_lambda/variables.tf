##################################################################################
# VARIABLES
##################################################################################

variable "name" {
	type = string
	description = "Determines the name of resources created"
}

variable "event_type" {
	type = string
	description = "Determines the event type of the created lambda can be 'origin-request' , 'origin-response', 'viewer-request' or 'viewer-response'"
}

variable "lambda_source_filename" {
	type = string
	description = "Full path and source name to the lambda function source code packaged zip"
}

variable "tags" {
  type        = map(string)
  default     = {}
  description = "Map object of AWS tags to add to each AWS resouce created"
}
