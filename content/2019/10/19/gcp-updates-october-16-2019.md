---
title: "GCP Updates | October 16, 2019"
tags:
- GCP
- GCP Updates
date: 2019-10-19T16:12:39+09:00
lastmod: 2019-10-19T16:12:39+09:00

draft: false
isCJKLanguage: true
---


# DATA ANALYTICS

## Cloud Dataproc – GPU support: GA

> Boost the performance of workloads, including machine learning and data processing, by attaching graphics processing units (GPUs) to master and worker Compute Engine nodes in a Cloud Dataproc cluster. Choose from options including NVIDIA® Tesla® P100, V100, and P4 GPUs. [Documentation](https://cloud.google.com/dataproc/docs/concepts/compute/gpus)

## BigQuery ML – k-means clustering support: GA

> Use unsupervised learning to aggregate your data into clusters and identify natural groupings. The [k-means](https://en.wikipedia.org/wiki/K-means_clustering) algorithm has been used for everything from understanding customer segmentation to computer vision and astronomy. [Documentation](https://cloud.google.com/bigquery-ml/docs/kmeans-tutorial)


# AI & MACHINE LEARNING

## Dialogflow – agent validation: beta

> Automatically check your agent for errors whenever you train it. Access the results from the Dialogflow Console or API, and choose to ignore or correct the errors to manage the quality and performance of your agent. [Documentation](https://cloud.google.com/dialogflow/docs/agents-validation)

## Dialogflow – regular expressions (regexp) for entities: GA

> Now you can provide [regular expressions](https://github.com/google/re2/wiki/Syntax) to create agents that match data patterns – such as national identification numbers or license plates – rather than specific terms. [Documentation](https://cloud.google.com/dialogflow/docs/entities-regexp)

## Dialogflow – fuzzy matching: GA

> Spend less time and effort constructing entities – and simplify development. Entity matching requires an exact match for one of the entity entries. Fuzzy matching allows entities to identify matches of a value or synonym regardless of the word order. [Documentation](https://cloud.google.com/dialogflow/docs/entities-fuzzy)


# COMPUTE

## Compute Engine – custom virtual network interface controller: beta

> Enable higher network bandwidth with a more efficient delivery network for sending traffic to and from your VM instances. Specifically designed for Compute Engine, the gVNIC device and driver will work on all Google Cloud VMs except memory-optimized machine types. [Documentation](https://cloud.google.com/compute/docs/instances/create-vm-with-gvnic)

## Kubernetes Engine – container-native load balancing: GA

> Enhance traffic visibility, performance, and scalability by creating services using [network endpoint groups (NEGs)](https://cloud.google.com/load-balancing/docs/negs/). NEGs ensure requests to your service are distributed directly to the containers serving the requests. [Documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/container-native-load-balancing) | [Blog](https://cloud.google.com/blog/products/containers-kubernetes/container-native-load-balancing-on-gke-now-generally-available)

NEGに移行したいなぁ。


## Kubernetes Engine – usage metering: GA

> View the usage profiles of Kubernetes Engine clusters and tie usage to individual teams, business units, apps, or environments within your organization based on namespaces and labels. Usage metering makes it easier to adopt Kubernetes in a multi-tenant environment. [Documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-usage-metering)

## Kubernetes Engine – containerd: GA

> Use containerd instead of Docker as the container runtime for Kubernetes on Container-Optimized OS and Ubuntu to execute apps within containers and handle interactions with the underlying host operating system. [Documentation](https://cloud.google.com/kubernetes-engine/docs/concepts/using-containerd)

実運用でどれぐらい変わるんだろうなー。


# NETWORKING

## VPC Flow Logs – log sampling, aggregation, and metadata exclusion: GA

> Balance your traffic visibility and storage costs – and lower monthly bills – by adjusting aggregation time interval, log-entry sampling, and metadata annotations to reduce the volume of data in your logs. [Documentation](https://cloud.google.com/vpc/docs/using-flow-logs#log-sampling)


# MANAGEMENT TOOLS

## Stackdriver Logging – support for exporting logs to partitioned tables: beta

> Improve BigQuery performance and gain greater control over your costs. Reduce the number of bytes read by a query by organizing the data you export to BigQuery into partitioned tables. [Documentation](https://cloud.google.com/logging/docs/export/bigquery#partition-tables)


# IDENTITY & SECURITY

## Kubernetes Engine – Binary Authorization: GA

> Ensure that only trusted containers run on Kubernetes Engine with this deploy-time security control. You can require images to be signed by trusted authorities during the development process and then enforce signature validation when deploying. [Documentation](https://cloud.google.com/binary-authorization/docs/) | [Blog](https://cloud.google.com/blog/products/identity-security/increasing-trust-in-google-cloud-visibility-control-and-automation)

## Cloud Identity and Access Management – Policy Troubleshooter: beta

> Use Policy Troubleshooter to examine all identity and access management policies that apply to a given resource, and determine whether a member has been granted permission to access that resource and, if so, by what policies. [Documentation](https://cloud.google.com/iam/docs/troubleshooting-access)

便利そう :sparkles:
今度なんかに困ったときに使ってみたい。


# DEVELOPER TOOLS

## Cloud Build – GitHub app triggers: beta

> Configure automatic builds of code stored in GitHub to enable GitOps-like CI/CD workflows. This release includes enhanced security features, new API methods to manage triggers, and greater flexibility and support for a broader range of build configurations. [Documentation](https://cloud.google.com/cloud-build/docs/run-builds-on-github)


