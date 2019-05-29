---
title: GCP Updates | May 28, 2019
tags: GCP, GCP Updates
created_at: 2019-05-29 00:00:00 +0900
updated_at: 2019-05-29 00:00:00 +0900
published: true
---

再開しました。


# HYBRID & MULTI-CLOUD

## Anthos Config Management: GA

> Manage configuration and enforce policy across your clusters – whether they’re on-premises or in the cloud. Set a declarative configuration for role-based access controls, resource quotas, and Namespaces – all from a single place. [Documentation](https://cloud.google.com/anthos/docs/concepts/anthos-overview#centralized_config_management) | [Blog](https://cloud.google.com/blog/topics/hybrid-cloud/new-platform-for-managing-applications-in-todays-multi-cloud-world)

GitOpsみたいなことができるっぽいけどContact Salesになってる。。。


# COMPUTE

## Kubernetes Engine – Intranode Visibility: beta

> This feature makes all your network traffic visible to the GCP network. You can see flow logs for all traffic between Pods, including traffic between Pods on the same node. And you can create firewall rules that apply to all traffic between Pods. [Documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/intranode-visibility)

Pod間のトラフィックに対してflow logとファイアウォールを有効にするもの。既存クラスタも有効にできる。

```bash
gcloud beta container clusters update [CLUSTER_NAME] --enable-intra-node-visibility
```

ファイアウォールについては特に記載がなかった。

## Compute Engine – reserving zonal resources: beta

> Reserve VM instances in a specific zone to ensure they’re available for future increases in demand, such as planned or unplanned spikes, large migrations, backup and disaster recovery, or planned growth. You can create or cancel a reservation at any time, with no commitment. [Documentation](https://cloud.google.com/compute/docs/instances/reserving-zonal-resources)

当然っちゃ当然ですが普通にお金かかるみたいですね。

# API PLATFORM & ECOSYSTEMS

## Apigee Developer Portal – audience management and developer teams: beta

> This release allows portal users to share responsibility for an app with other portal users, as well as segment individuals in order to control access to content. [Documentation](https://docs.apigee.com/release/notes/190507-apigee-edge-public-cloud-release-notes-ui#teams-audience-management) | [Blog](https://community.apigee.com/idea/68536/introducing-developer-programs-and-the-developer-t.html)


# AI & MACHINE LEARNING

## AI Platform Notebooks: beta

> This managed enterprise notebook service helps you get projects up and running in minutes. In one click, you can create instances in JupyterLab that come pre-installed with the latest data science and machine learning frameworks. The service is available through AI Platform in the Google Cloud Platform Console.
 [Documentation](https://cloud.google.com/ml-engine/docs/notebooks/)


# MOBILE APP DEVELOPMENT

## Firebase – shared iOS keychain: beta

> Share authentication states across multiple apps or extensions on iOS. This allows users to sign in or out once and have the action apply across all apps that belong to the same access group. [Documentation](https://firebase.google.com/docs/auth/ios/single-sign-on)


# IDENTITY & SECURITY

## GKE Sandbox: beta

> Get increased security for your Kubernetes Engine containers – without added complexity. This managed service, based on the open-source project gVisor, is a container-isolation solution that provides a second layer of defense between your containerized workloads on Kubernetes Engine. [Product page](https://cloud.google.com/kubernetes-engine/sandbox/) | [Blog](https://cloud.google.com/blog/products/identity-security/increasing-trust-in-google-cloud-visibility-control-and-automation)

GKEでgVisorが使えるやつ。GKE Sandboxを有効にしたNode Poolを新しく作ってPod templateで`runtimeClassName: gvisor`とすれば使える。
いろいろ制約があるみたいなので使うときは注意が必要ですね。
