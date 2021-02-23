##################################################################################
# Provider
##################################################################################
# Provider must be us_east_1 for Edge Lambda functions
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

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
  name               = "${var.name}-georestriction-edge-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy_doc.json
  tags               = var.tags
}

# data aws_iam_policy_document lambda_logs_policy_doc {
#   statement {
#     effect    = "Allow"
#     resources = ["*"]
#     actions = [
#       "logs:CreateLogStream",
#       "logs:PutLogEvents",
#       "logs:CreateLogGroup",
#     ]
#   }
# }

# resource aws_iam_role_policy logs_role_policy {
#   name   = "${var.name}-georestriction-edge-lambda-logs"
#   role   = aws_iam_role.lambda_at_edge.id
#   policy = data.aws_iam_policy_document.lambda_logs_policy_doc.json
# }

# resource aws_cloudwatch_log_group log_group {
#   name = "/aws/lambda/${var.name}"
#   tags = var.tags
# }

resource "aws_lambda_function" "edge_lambda" {
	filename		= var.lambda_source_filename
	function_name	= "${var.name}-georestriction-edge-lambda"
	role			= aws_iam_role.lambda_at_edge.arn
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

	tags = var.tags
}
