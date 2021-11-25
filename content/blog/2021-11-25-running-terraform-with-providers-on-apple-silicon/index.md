---
title: Running terraform with providers on Apple Silicon
date: 2021-11-25
---

If you use custom providers with Terraform, many of the probably won't work on Apple Silicon. You can work around this
using docker.

I created a file in my terraform directory called `run-terraform.sh` with this in it:

```
docker run -v `pwd`:`pwd` -w `pwd`/prod --env-file ../../.env -it hashicorp/terraform:latest $1
```

Now just use this script in place of the old `terraform` command like so:

```
./run-terraform.sh init
./run-terraform.sh plan
./run-terraform.sh apply
```

It's probably best to migrate to Terraform Cloud at this point. However, if you're already on Apple Silicon, the above
advice will still be useful during the migration. To migrate to Terraform Cloud (super easy), just:

1. [Create an account](https://www.terraform.io/cloud)
1. Run `terraform login` and login.
1. Add a `backend` block to root config:

```
terraform {
  backend "remote" {
    organization = "zipflow-eng"

    workspaces {
      name = "zipflow-prod"
    }
  }
}
```

1. Run `terraform init` (you may need to run this using docker because of the catch-22 where you need the providers installed and working for init to finish the migration)
1. It will prompt to see if you want to migrate your state to the cloud. Say "yes"
1. After init, you should copy your `tfstate` files somewhere else (just in case)
1. Now you can run `terraform apply` and it will run apply in the cloud and save your state in the cloud.

You might need a bit more to get the docker version running with all the files included, including where `terraform login`
stores your token:

```
docker run \
  -v `pwd`:`pwd` \
  -v /Users/adamkirk/.config/digitalocean:/Users/adamkirk/.config/digitalocean \
  -v /Users/adamkirk/.terraform.d:/root/.terraform.d \
  -w `pwd`/dev \
  -a stdout -a stderr \
  --env-file ../../.env \
  -it \
  hashicorp/terraform:latest  $1
```