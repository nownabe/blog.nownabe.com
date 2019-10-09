---
title: "GCP Updates | Semtember 30, 2019"
tags:
- GCP
- GCP Updates
date: 2019-10-09T12:24:12+09:00
lastmod: 2019-10-09T12:24:12+09:00

draft: false
isCJKLanguage: true
---


# COMPUTE

## Compute Engine – name change for memory-optimized VMs: GA

> To more clearly identify VM instances as members of the memory-optimized machine-type family, all n1-ultramem and n1-megamem VMs have had their “n1” prefix changed to “m1”. [Documentation](https://cloud.google.com/compute/docs/machine-types#m1_machine_types)


## Compute Engine – persistent disk scheduled snapshots: GA

> Use snapshot schedules to regularly and automatically back up your Compute Engine workloads as well as your zonal and regional persistent disks. And define how long to keep snapshots with a snapshot retention policy. [Documentation](https://cloud.google.com/compute/docs/disks/scheduled-snapshots)

いままでなかったのか :flushed:


# AI & MACHINE LEARNING

## AI Platform – custom containers: GA

> Run your apps in a Docker image by building your own custom container to run jobs on AI Platform. Use machine learning frameworks and versions – as well as non-ML dependencies, libraries, and binaries not otherwise supported on AI Platform. [Documentation](https://cloud.google.com/ml-engine/docs/containers-overview)

中ではCloud Runが使われてんのかな :thinking:

AI Platformの方のドキュメント見るとDockerのインストールとかDockerfileの書き方とかまで書いてあっておもしろい。

## AI Platform – use predefined machine-type names to configure training job: GA

> Gain greater flexibility when allocating computing resources for training machine learning jobs by using names of certain predefined Compute Engine machine types. You can also customize how your job uses GPUs when training with TensorFlow or using custom containers. [Documentation](https://cloud.google.com/ml-engine/docs/machine-types#compute-engine-machine-types)



## Cloud Video Intelligence API – logo detection: beta

> Detect, track, and recognize the presence of over 100,000 brands and logos in video content. [Documentation](https://cloud.google.com/video-intelligence/docs/logo-recognition)


# SECURITY

## Cloud Data Loss Prevention – new Google Cloud Platform Console user interface: GA

> Gain greater visibility and control over sensitive data with the new Cloud DLP UI. Inspect and classify data in Cloud Storage, BigQuery, and Cloud Datastore repositories with a few clicks. Manage inspection jobs, create templates, and examine findings in your console. [Documentation](https://cloud.google.com/dlp/docs/dlp-ui)



## Cloud Asset Inventory – Organization Policy and Access Policy support: GA

> View and assess more resource and policy types in one centralized, managed inventory service with the newly onboarded policies. [Documentation](https://cloud.google.com/asset-inventory/docs/overview)

## Identity Platform multi-tenancy support: beta

> Create unique silos of users and configurations within a single Identity Platform project to set up data-isolation boundaries. The silos can represent different customers, business units, subsidiaries, or other identifying characteristics. [Documentation](https://cloud.google.com/identity-platform/docs/multi-tenancy)


# ANTHOS

## GCP Marketplace Private Pricing: beta

> Create custom quotes for prospective customers for your Kubernetes apps or integrated SaaS solutions with GCP Marketplace Private Pricing. The quote gives customers the ability to purchase your product on the GCP Marketplace at the negotiated price in their GCP Console. [Documentation](https://cloud.google.com/marketplace/docs/partners/create-quotes)

