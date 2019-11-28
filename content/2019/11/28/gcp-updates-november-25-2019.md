---
title: "GCP Updates | November 25 2019"
tags:
- GCP
- GCP Updates
date: 2019-11-28T14:58:32+09:00
lastmod: 2019-11-28T14:58:32+09:00

draft: false
isCJKLanguage: true
---

# AI & MACHINE LEARNING

## Cloud AutoML Vision – image classification: beta refresh

> The unified infrastructure now supports both classification and object detection, and has an integrated UI. Plan ahead and prepare your classification models for the general availability of AutoML Vision scheduled to take place later this year. Use [these steps](https://cloud.google.com/vision/automl/docs/release-notes#October_17_2019) to update current models. [Release notes](https://cloud.google.com/vision/automl/docs/release-notes#October_09_2019) | [Documentation](https://cloud.google.com/vision/automl/docs/)

## Cloud AutoML Vision – batch prediction: beta

> Use batch prediction for lower cost per inference and higher throughput than synchronous (online) prediction. Available for both classification and object detection. [Release notes](https://cloud.google.com/vision/automl/docs/release-notes#October_14_2019)

低コストのバッチで推論できるのいいですね。

## Cloud AutoML Vision – TensorFlow.js integration: beta

> Export AutoML Vision Edge models as TensorFlow.js packages. The edge model can be deployed in a range of platforms with TensorFlow.js support, including all major browsers – and server-side in Node.js. Available for both classification and object detection. [Release notes](https://cloud.google.com/vision/automl/object-detection/docs/release-notes#October_14_2019)

アツい

# COMPUTE

## Compute Engine – enhanced block storage performance: GA

> SSD persistent disks now offer double the write-throughput for VM instances with 16 or more cores and 100K read IOPS for VM instances with 64 or more cores. [Documentation](https://cloud.google.com/compute/docs/disks/performance)

## Compute Engine – increase total capacity for persistent disks: GA

> Attach up to 257 TB of persistent disk storage space to each VM instance – a considerable boost from the previous 64 TB limit. [Documentation](https://cloud.google.com/compute/docs/disks/#pdspecs)

## Compute Engine – OS Login Policy and audit logging: GA

> Manage access to instances with organization policies and audit logging to ensure that all new projects, and the VM instances created in them, have OS Login enabled. Track events and activities like adding, deleting, or updating an SSH key, or deleting POSIX information. [Documentation](https://cloud.google.com/compute/docs/oslogin/manage-oslogin-in-an-org)

クラウド側でこれやってくれるのめっちゃ助かるなー。

## Google Kubernetes Engine – Rapid, Regular, and Stable release channels: beta

> Create new clusters using a [Rapid](https://cloud.google.com/kubernetes-engine/docs/release-notes-rapid), [Regular](https://cloud.google.com/kubernetes-engine/docs/release-notes-regular), or [Stable](https://cloud.google.com/kubernetes-engine/docs/release-notes-stable) release channel. Channels represent the level of stability and freshness of GKE versions, and you can pick the channel most aligned with your risk profile and business needs. [Documentation](https://cloud.google.com/kubernetes-engine/docs/concepts/release-channels)

組織によって適切な更新頻度に設定したり、Kubernetesの新しい機能をGKEで試しやすくなったりするからとてもありがたい。


## GKE – vertical pod autoscaling: GA

> Get more stable, efficient pods automatically. When enabled, the vertical pod autoscaling feature recommends, and can automatically update, memory and CPU requests and limits for the containers in your pods based on observed usage. [Documentation](https://cloud.google.com/kubernetes-engine/docs/concepts/verticalpodautoscaler)

これみんなどういうふうに使ってんだろ。

## GKE – node auto-provisioning: GA

> Create a new node pool in GKE cluster autoscaler if none of the existing node pools can accommodate pending pods or if running the pods on a new node pool is significantly less expensive. [Documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-provisioning)

Node poolを作ったり消したりするってことか。
結局いろいろauto-provisioningの設定しないといけないっぽいけど、もし多めに設定してたnode poolsのキャパシティがいっぱいになったとしても新しいの作れるよ、っていうこと？

## App Engine – Java 11 on App Engine standard environment: GA

> Build and deploy an application with Java 11 that runs reliably under a heavy load and with large amounts of data. Run your application within its own secure, reliable environment, independent of the hardware, operating system, or physical location of the server. [Documentation](https://cloud.google.com/appengine/docs/standard/java11/) | [Blog](https://cloud.google.com/blog/products/application-development/app-engine-java-11-is-ga-deploy-a-jar-scale-it-all-fully-managed)


# DATA ANALYTICS

## Cloud Dataflow – Python streaming mode: GA

> Explore the newest Cloud Dataflow streaming option for your Python pipeline, including autoscale, drain, update, Streaming Engine, and counter updates. [Documentation](https://cloud.google.com/dataflow/docs/guides/specifying-exec-params#streaming-execution)

おー、ようやく。

## Cloud Dataflow – Python 3 support: GA

> Author your Apache Beam pipelines in Python 3 and launch on Cloud Dataflow. Apache Beam will discontinue Python 2 support in new releases starting January 1, 2020. We advise Cloud Dataflow users to migrate their pipelines to Python 3. [Documentation](https://beam.apache.org/blog/2019/10/07/beam-2.16.0.html)

ついに :joy:


# MANAGEMENT TOOLS

## GKE – system-only logging and monitoring: beta

> Select the system-only option to ignore workload logs and capture only logs for GKE system components. This feature is useful for capturing system logs for cluster management and support purposes when using an alternative logging backend. [Documentation](https://cloud.google.com/monitoring/kubernetes-engine/installing#controlling_the_collection_of_application_logs)


# NETWORKING

## Google Cloud Armor – WAF capabilities: beta

> Defend against DDoS attacks and filter incoming traffic based on attributes across layers 3–7. You can also create custom rules using any combination of L3–L7 parametersand geolocation data, and use predefined rules to defend against XSS and SQLi attacks. [Product page](https://cloud.google.com/armor/) | [Documentation](https://cloud.google.com/armor/docs/) | [Release notes](https://cloud.google.com/armor/docs/release-notes)


# SECURITY

## Cloud Identity and Access Management – service account descriptions: GA

> Add an optional description for your service account to further organize, identify, and differentiate your accounts from one another. [Documentation](https://cloud.google.com/iam/docs/creating-managing-service-accounts#updating)


# SUPPORT

## Group support for Enterprise Support customers: beta

> Enterprise Support customers can now assign support roles to Google Groups as well as individual user accounts. This allows for more efficient bulk management of support users. [Documentation](https://cloud.google.com/support/docs/role-based-support)
