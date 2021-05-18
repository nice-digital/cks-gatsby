##################################################################################
# VARIABLES
##################################################################################

variable "name" {
	type = string
	description = "Determines the name of resources created"
}

variable "origin_request_edge_lambda_qualified_arn" {
	type = string
	description = "The qualified ARN of the lambda. Needs to be of format arn:aws:lambda:us-east-1::functionname:{#versionnumber}"
}

variable "origin_repsonse_edge_lambda_qualified_arn" {
	type = string
	description = "The qualified ARN of the lambda. Needs to be of format arn:aws:lambda:us-east-1::functionname:{#versionnumber}"
}

variable "viewer_request_edge_lambda_qualified_arn" {
	type = string
	description = "The qualified ARN of the lambda. Needs to be of format arn:aws:lambda:us-east-1::functionname:{#versionnumber}"
}

variable "release_number" {
	type = string
	description = "Version number of of the release. This is used to create a seperate versioned folder in the S3 bucket and sets cloudfront to point to it"
}

variable "tags" {
  description = "Map object of AWS tags to add to each AWS resouce created"
  type        = map(string)
  default     = {}
}
