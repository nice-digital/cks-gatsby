##################################################################################
# Provider
##################################################################################

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

##################################################################################
# Locals
##################################################################################

locals {
	lambda_name = "${var.application_name}-${var.lambda_name}-${var.environment_name}"
}

##################################################################################
# Resources
##################################################################################

data aws_iam_policy_document assume_role_policy_doc {
  statement {
    sid    = "AllowAwsToAssumeRole"
    effect = "Allow"

    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "lambda.amazonaws.com",
        "edgelambda.amazonaws.com",
      ]
    }
  }
}

resource aws_iam_role lambda_at_edge {
  name               = "cks-lambda-edge-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy_doc.json
#   tags               = var.tags
}


/**
 * Allow lambda to write logs.
 */
data aws_iam_policy_document lambda_logs_policy_doc {
  statement {
    effect    = "Allow"
    resources = ["*"]
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",

      # Lambda@Edge logs are logged into Log Groups in the region of the edge location
      # that executes the code. Because of this, we need to allow the lambda role to create
      # Log Groups in other regions
      "logs:CreateLogGroup",
    ]
  }
}

/**
 * Attach the policy giving log write access to the IAM Role
 */
resource aws_iam_role_policy logs_role_policy {
  name   = "cks-at-edge"
  role   = aws_iam_role.lambda_at_edge.id
  policy = data.aws_iam_policy_document.lambda_logs_policy_doc.json
}

/**
 * Creates a Cloudwatch log group for this function to log to.
 * With lambda@edge, only test runs will log to this group. All
 * logs in production will be logged to a log group in the region
 * of the CloudFront edge location handling the request.
 */
resource aws_cloudwatch_log_group log_group {
  name = "/aws/lambda/cks-cf-logs"
#   tags = var.tags
}

resource "aws_lambda_function" "edge_lambda" {
  filename      = var.lambda_source_filename
  function_name = local.lambda_name
#   role          = aws_iam_role.iam_for_lambda.arn
  role          = aws_iam_role.lambda_at_edge.arn
  handler 		= "index.handler"
  runtime 		= "nodejs12.x"
  publish 		= true

  provider = aws.us_east_1

  source_code_hash = filebase64sha256(var.lambda_source_filename)

    lifecycle {
    ignore_changes = [
      last_modified,
    ]
  }
}
