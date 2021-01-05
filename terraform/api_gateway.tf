module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "~> 0.0"

  name          = "CKS-search-api"
  description   = "CKS Search API Gateway"
  protocol_type = "HTTP"

  create_api_domain_name = false

  default_stage_access_log_format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage"

  integrations = {
    "GET /" = {
      lambda_arn             = module.lambda.this_lambda_function_arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
    }

    "$default" = {
      lambda_arn = module.lambda.this_lambda_function_arn
    }

  }

}
