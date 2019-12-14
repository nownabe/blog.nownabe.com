---
title: "GCP Updates | December 9, 2019"
tags:
- GCP
- GCP Updates
date: 2019-12-13T17:48:21+09:00
lastmod: 2019-12-13T17:48:21+09:00

draft: false
isCJKLanguage: true
---

Product updates | December 9, 2019


# AI & MACHINE LEARNING

## AutoML Tables – data residency for EU: beta

> AutoML Tables now provides full support to users with EU data residency requirements. [Documentation](https://cloud.google.com/automl-tables/docs/locations) | [Release notes](https://cloud.google.com/automl-tables/docs/release-notes)

GDPR大変そう

## Contact Center AI: GA

> Automate call center interactions and provide seamless handoffs to human agents with Virtual Agent. Use Agent Assist to transcribe calls in real time, identify customer intent, and provide real-time, step-by-step assistance to your live agents. [Solutions page](https://cloud.google.com/solutions/contact-center/) | [Blog](https://cloud.google.com/blog/products/ai-machine-learning/contact-center-ai-now-ga)


# COMPUTE

## Google Kubernetes Engine – Batch on GKE: beta

> Run your batch workload in the cloud using Kubernetes with flexible resources that are dynamically allocated to match your needs and budget. Create queues, prioritize jobs, and handle dependencies with the functions and familiarity of a traditional batch job scheduler. [Documentation](https://cloud.google.com/kubernetes-engine/docs/concepts/batch) | [Blog](https://cloud.google.com/blog/topics/hpc/introducing-batch-gke-modernizing-hpc-kubernetes-cloud)

GKEで大規模なバッチ処理を実行するためのものみたいです。
JobやQueue、Budgetなどなどを持ってるらしい。

インストールは今の所[GitHub](https://github.com/GoogleCloudPlatform/Kbatch/tree/master/releases)にあるYAMLをapplyして行います。

こんな感じのCRDがありました。

```bash
$ egrep '\skind: [^"]' install/01-crds.yaml
    kind: BatchBudget
    kind: BatchCostModel
    kind: BatchJobConstraint
    kind: BatchJob
    kind: BatchNode
    kind: BatchPriority
    kind: BatchQueue
    kind: BatchTask
    kind: BatchUserContext
```

Jobの作成には先ほどのアーカイブに同梱されているksubコマンドを使うみたいです。
ksubで[Bashスクリプト](https://github.com/GoogleCloudPlatform/Kbatch/tree/master/samples/defaultresources)を指定するみたいです。

面白そうなのでまた触ってみたい。


# DATA ANALYTICS

## BigQuery – audit logs v2: GA

> Gain greater insight into your BigQuery resources with BigQueryAuditMetadata, a newer format of audit log messages. Understand resource interactions and identify which tables were read from and written to by a given query job and which tables have expired. [Documentation](https://cloud.google.com/bigquery/docs/reference/auditlogs/#bigqueryauditmetadata_format)

## BigQuery and BigQuery ML – new region: GA

> BigQuery and Biguery ML are now available in the South Carolina (us-east1) region. [Release notes](https://cloud.google.com/bigquery/docs/release-notes) | [Release notes](https://cloud.google.com/bigquery-ml/docs/release-notes)

## Cloud Dataflow – Flexible Resource Scheduling: GA

> Reduce batch processing costs – without changing pipeline code. FlexRS uses advanced scheduling techniques, Dataflow Shuffle, and a combination of preemptible virtual machine instances and regular VMs to reduce worker costs up to 40%. [Documentation](https://cloud.google.com/dataflow/docs/guides/flexrs) | [Blog](https://cloud.google.com/blog/products/data-analytics/streaming-analytics-now-simpler-more-cost-effective-cloud-dataflow)

いいですね。


# DATABASE

## Cloud Datastore – managed export and import service: GA

> Export and import Cloud Datastore entities using your Cloud Console, the gcloud command-line tool, or the Cloud Datastore API. Use the service to recover from accidental deletion of data and export data for offline processing. [Documentation](https://cloud.google.com/datastore/docs/export-import-entities)

おー、ついにGA :tada:


# DEVELOPER TOOLS

## Cloud Code – Visual Studio Code Stackdriver Log Viewer: GA

> Access your Stackdriver logs directly in the Visual Studio Code IDE. Simplify and streamline the diagnostics process with features including integration with Stackdriver Logging, a customizable logs viewer, and Kubernetes-specific filtering. [Documentation](https://cloud.google.com/code/docs/vscode/logging) | [Blog](https://cloud.google.com/blog/products/application-development/stackdriver-logging-comes-to-cloud-code-in-visual-studio-code)

Documentationにある動画みたけど便利そう。
公式でこういうのだしてくれるのいいなー。

## Go developer hub and discovery site: beta

> Visit the new site to discover and evaluate Go packages and modules – and learn how to integrate them into your projects. Find a wealth of resources to get started with the language, featured use cases, and case studies of companies that use Go. [Product page](https://go.dev/) | [Blog](https://blog.golang.org/go.dev)

Goの新しいサイト？

# IDENTITY & SECURITY

## Cloud Identity and Access Management – Service Account Short-Lived Credentials API: GA

> Enhance security and usability by allowing users to create short-lived credentials for service accounts. Reduce the need to manage downloaded keys and provide a way to impersonate service account identities securely to access GCP and non-GCP APIs. [Documentation](https://cloud.google.com/iam/docs/creating-short-lived-service-account-credentials)

## Identity Platform – multi-tenancy support: GA

> Create and manage multiple tenants within a single instance of Identity Platform. Tenants can operate autonomously, with their own authentication methods and users, even if they’re part of the same instance. [Product page](https://cloud.google.com/identity-platform/) | [Blog](https://cloud.google.com/blog/products/identity-security/multi-tenancy-support-identity-platform-now-generally-available)


# MANAGEMENT TOOLS

## Cloud Billing – Committed Use Discount Analysis report: GA

> Analyze your Compute Engine resource footprint alongside your commitments. Easily visualize, understand, and optimize the effectiveness, utilization rate, and financial impact of your committed use discounts. [Documentation](https://cloud.google.com/billing/docs/how-to/cud-analysis)

## Cloud Billing Budget API: beta

> View, create, and manage budgets programmatically at scale and receive alerts when your spend on services goes above an assigned threshold. Create separate budgets for your Google Cloud Platform projects, bulk update budgets, and add budget creation to your cloud provisioning workflow. [Documentation](https://cloud.google.com/billing/docs/how-to/budget-api-overview)

## Stackdriver – Service Monitoring API: beta

> Mitigate risk to your microservices with new monitoring features that allow you to select metrics that act as service-level indicators, to define service-level objectives, and to track the health of your service with error budgets. [Documentation](https://cloud.google.com/monitoring/service-monitoring/)


# MIGRATION

## Migrate for Anthos: GA

> Migrate existing VMware, Amazon EC2, Microsoft Azure, and Compute Engine VMs to containers directly on GKE in minutes, minimize downtime with streaming storage migration, and automatically transform workloads to run as containers in GKE pods. [Release notes](https://cloud.google.com/migrate/anthos/docs/release-notes)

すげぇ

## Migrate for Compute Engine v4.8: GA

> Migrate Microsoft Azure instances to Compute Engine with enhanced scale, reduced initial downtime and the ability to monitor the source cloud environment during migration. Additional features include the ability to manage system upgrades and patch installation via the system UI. [Release notes](https://cloud.google.com/migrate/compute-engine/docs/4.8/release-notes)


# NETWORKING

## Google Cloud Armor – findings and assets in Cloud Security Command Center: beta

> Enhance visibility into potential attacks with two new findings from Google Cloud Armor: traffic spikes and increasing rate of denied traffic to the Cloud Security Command Center. [Documentation](https://cloud.google.com/armor/docs/cscc-findings)

よさそう。

## Traffic Director – route rules and traffic policies: GA

> Control traffic within your Traffic Director deployment by using route rules and traffic policies to implement traffic splitting, traffic steering, fault injection, circuit breaking, and mirroring. Traffic policies further manage traffic using a range of actions. [Documentation](https://cloud.google.com/traffic-director/docs/traffic-control)

お、GAなったのか。使ってみたいなー。

## Virtual Private Cloud – Packet Mirroring: beta

> Inspect all traffic in your network to perform advanced security analytics, and troubleshoot app performance, for both Compute Engine instances and GKE clusters. Clone traffic in specific instances in your VPC to a private collector endpoint to run security and monitoring software on the collector back ends. [Documentation](https://cloud.google.com/vpc/docs/packet-mirroring) | [Video](https://www.youtube.com/watch)

いいね！GCEインスタンスだけが対象かな。そのうちコンテナとかも対象にできるようになんのかな。

## VPC – custom routes: GA

> Import and export custom routes to peer VPC networks, and exchange static and dynamic routes, so that workloads in different VPC networks can communicate in private RFC 1918 space. All traffic stays within Google’s network, and doesn’t cross the public internet. [Documentation](https://cloud.google.com/vpc/docs/vpc-peering#importing-exporting-routes)

## Network Intelligence Center – Network Topology and Connectivity Tests: beta

> Gain an organization-wide view into your global GCP deployment, diagnose connectivity issues, and predict the impact of configuration changes with [Network Topology](https://cloud.google.com/network-intelligence-center/docs/network-topology/) and [Connectivity Tests](https://cloud.google.com/network-intelligence-center/docs/connectivity-tests/). [Blog](https://cloud.google.com/blog/products/networking/announcing-network-intelligence-center) | [Video](https://www.youtube.com/watch) | [Video](https://www.youtube.com/watch)

便利そう！
