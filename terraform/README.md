# Terraform deployment config for CKS

> A Terraform project to create, build and deploy complete AWS environments for CKS using Teamcity and Octopus Deploy

## Stack

- [Visual Studio Code](https://visualstudio.microsoft.com/vscode/)
- [AWS Command Line Interface](https://aws.amazon.com/cli/)
- [Terraform 0.14^](https://www.terraform.io/)
- [WSL 2 (optional)](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
- [Ubuntu for WSL (optional)](https://ubuntu.com/wsl) - download from Microsoft Store after installing WSL 2
- [Windows Terminal (optional)](https://devblogs.microsoft.com/commandline/windows-terminal-1-0/)
- [AWS CLI](https://aws.amazon.com/cli/)

## :rocket: Set up

## Running locally

It is possible to run, debug and deploy this locally in either WSL 2 or Windows. You need to install terraform and its dependencies which can be quite a hassle on Windows - hence I recommend using WSL 2.

### Install Terraform tools and AWS cli (WSL 2)

1. Install terraform via apt-get `sudo apt install terraform` - this will install all the dependencies such as go lang (which is why using Linux is easier)
1. Make sure you can run `terraform --version` (be aware that some features are version specific and this guide was assuming you are installing Terraform 0.14.xx)
1. Install latest version of AWS cli - using link above again this is easier if you are using Linux
1. Make sure you setup AWS Cli credentials correctly - more info [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
   1. These credentials consist of a key Id and secret

### Deploy/Run Locally

1. Make sure you have built a local copy of CKS Gatsby (it should be in ../gatsby/public)
1. Open linux shell and change into the terraform dir
1. Run `./deploy-terraform.sh -e "local" -r "5"` - this will deploy the terraform config stored in the "local" environment folder to AWS - it will create everything using the prefix nice-cks-local-xxxx
1. Once the terraform deployment has finished you can deploy the static Gastby files to the S3 bucket using `./deploy-static-to-s3.sh -r "5" -p "../gatsby/public/" -e "local"`

## Running in Teamcity / Octopus Deploy

Everything is configured to run and will deploy automatically as the steps above - however the environment that is passed to the scripts will be the Teamcity environment eg "dev" or "test etc...

## Terraform-Docs

[Terraform-docs](https://github.com/terraform-docs/terraform-docs) has been used to create automatic documentation of the various Terraform modules. It uses the information from the terraform.tf files to do this. It can append this information based on templates directly into an output file. In this case we are adding this content to the README.md files in the root of each module.

### To create a Terraform readme

1. Install terraform-docs (easy way is to use apt-get in Linux or chocolatey in Windows)
1. Run `terraform-docs.exe .\dev\` to create the README.md file in .\dev
1. Note that terraform-docs stores its config in .terraform-docs.yml.

## License

MIT Licensed. See [LICENSE](https://github.com/nice-digital/cks-gatsby/blob/master/LICENSE) for full details.
