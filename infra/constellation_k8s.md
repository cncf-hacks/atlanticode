# Constellation Kubernetes Installation Guide

This guide will walk you through the installation process of Constellation Kubernetes. Before you begin, ensure that you have the necessary prerequisites installed and configured on your system.

Constellation Kubernetes is the backbone of Atlantis Stack. It is a Kubernetes engine that aims to provide the best possible data security. Everything inside is always encrypted, including at runtime in memory. For this, Constellation leverages a technology called confidential computing and more specifically Confidential VMs.

For more information about Constellation Kubernetes, visit the [Constellation GitHub](https://github.com/edgelesssys/constellation) repository.

## Prerequisites
- Your machine is running Linux, macOS, or Windows
- You have admin rights on your machine
- `kubectl` is installed
- Your CSP is Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform (GCP), or STACKIT
- `cli` access to your desired CSP

## Installation Steps
1. Download the CLI
```
curl -LO https://github.com/edgelesssys/constellation/releases/latest/download/constellation-linux-amd64
```

2. Install the CLI to your PATH:
```
sudo install constellation-linux-amd64 /usr/local/bin/constellation
```

> **_NOTE:_**  We installed the constellation kubernetes cluster in AWS, so from now on the install guide will target AWS cloud.

3. Create the IAM role with the following permissions:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeAccountAttributes",
                "iam:AddRoleToInstanceProfile",
                "iam:AttachRolePolicy",
                "iam:CreateInstanceProfile",
                "iam:CreatePolicy",
                "iam:CreateRole",
                "iam:DeleteInstanceProfile",
                "iam:DeletePolicy",
                "iam:DeletePolicyVersion",
                "iam:DeleteRole",
                "iam:DetachRolePolicy",
                "iam:GetInstanceProfile",
                "iam:GetPolicy",
                "iam:GetPolicyVersion",
                "iam:GetRole",
                "iam:ListAttachedRolePolicies",
                "iam:ListInstanceProfilesForRole",
                "iam:ListPolicyVersions",
                "iam:ListRolePolicies",
                "iam:PassRole",
                "iam:RemoveRoleFromInstanceProfile",
                "sts:GetCallerIdentity"
            ],
            "Resource": "*"
        }
    ]
}
```

4. Generate the configuration file for constellation cluster
```
constellation config generate aws
```
5. Edit the generated `constellation-conf.yaml` file to match your setup
6. Apply the constellation config file
```
constellation apply
```
7. Interact with your cluster
```
export KUBECONFIG="$PWD/constellation-admin.conf"
```