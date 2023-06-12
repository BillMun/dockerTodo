# main.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">4.45.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_ecr_repository" "track_that_baby_repo" {
  name = "track_that_baby_repo"
}