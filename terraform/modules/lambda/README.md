# AWS Lambda Terraform module

Terraform module which creates Edge functions for use with AWS API Gateway (v2)

## Usage

### Api Gateway (v2) HTTP Get event

```hcl
module "lambda" {
	source = "../modules/lambda"
	name = "${local.name}-search"

	lambda_source_filename = var.search_lambda_source_filename
	apigatewayv2_api_execution_arn = module.api_gateway.this_apigatewayv2_api_execution_arn

	tags = local.default_tags
}
```

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 0.14 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.36 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.36 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_iam_role.iam_for_lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_lambda_function.dotnet_lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function) | resource |
| [aws_lambda_permission.api_gateway_execute](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_permission) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_apigatewayv2_api_execution_arn"></a> [apigatewayv2\_api\_execution\_arn](#input\_apigatewayv2\_api\_execution\_arn) | ARN of the AWS Api Gateway v2 to which to grant excute permssions to | `string` | n/a | yes |
| <a name="input_lambda_source_filename"></a> [lambda\_source\_filename](#input\_lambda\_source\_filename) | Full path and source name to the lambda function source code packaged zip | `string` | n/a | yes |
| <a name="input_name"></a> [name](#input\_name) | Determines the name of resources created | `string` | n/a | yes |
| <a name="input_tags"></a> [tags](#input\_tags) | Map object of AWS tags to add to each AWS resouce created | `map(string)` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_this_lambda_arn"></a> [this\_lambda\_arn](#output\_this\_lambda\_arn) | The arn of the lambda |
| <a name="output_this_lambda_id"></a> [this\_lambda\_id](#output\_this\_lambda\_id) | The name of the lambda |
| <a name="output_this_lambda_invoke_arn"></a> [this\_lambda\_invoke\_arn](#output\_this\_lambda\_invoke\_arn) | The arn to invoke the lambda from apigateway |

<!-- END_TF_DOCS -->

## License

MIT Licensed. See [LICENSE](https://github.com/nice-digital/cks-gatsby/blob/master/LICENSE) for full details.
