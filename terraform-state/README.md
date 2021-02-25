# CKS Terraform State

> Basic Terraform project to create the state storeage for a terraform project using AWS S3

[**:rocket: Jump straight to getting started**](#rocket-set-up)

## What is it?

This basic Terraform project is to create a shared Terraform state stored in an AWS bucket. It is mainly intended to be used to document the steps needed to create such a setup to allow for consistent creations in the future.

## Stack

### Infrastructure

This project is intended to be run locally and will create resources in AWS

### Software

- [Terraform](https://www.terraform.io/)
- [AWS CLI](https://aws.amazon.com/cli/) used by Terraform

## :rocket: Set up

The easiest way to get the project running is:

1. Install and configure AWS CLI
1. Install Terraform
1. Make sure you set your credentials (in the form of a an access key and secret) using `aws configure` command (see main Terraform project for info on AWS credentials)
