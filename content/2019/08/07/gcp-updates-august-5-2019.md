---
title: "GCP Updates | August 5, 2019"
tags:
  - GCP
  - GCP Updates
date: 2019-08-07T17:08:23+09:00
lastmod: 2019-08-07T17:08:23+09:00

draft: false
isCJKLanguage: true
---

# STORAGE & DATABASES

## Cloud Storage – dual-regional bucket locations: GA

> Combine the performance boost of having two specific regional locations for object data storage with the advantages of geo-redundancy. [Documentation](https://cloud.google.com/storage/docs/locations)

dual-regional は multi-regional の特別なやつらしい。Console で試してみると、

- nam4 (Iowa and South Carolina)
- us (multiple region in United States)

みたいになってた。

リージョン間で冗長化したいけど、Regional と同じパフォーマンスが欲しい場合に使うらしい。いいね。

# DATA ANALYTICS

## BigQuery – persistent user-defined functions: beta

> Now you can create persistent user-defined functions (UDFs) in BigQuery using a SQL expression or JavaScript. This allows you to reuse functions across queries and share them with others. You can also create a shared UDF library that anyone with access to your dataset can call up in queries. [Documentation](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#create_function_statement)

BigQuery で使えるのいいよなー。

## Cloud Pub/Sub – authenticated push: GA

> With this release, you can configure push subscriptions to provide an authentication token that allows the endpoints to authorize the requests. Authorization using these tokens is currently supported by Cloud Run natively. [Documentation](https://cloud.google.com/pubsub/docs/push)

## BigQuery Data Transfer Service for Google Merchant Center: beta

> This service allows you to automatically schedule and manage recurring daily load jobs into BigQuery for Google Merchant Center reporting data. Currently, the BigQuery Data Transfer Service supports product catalog and diagnostic data provided to Merchant Center. [Documentation](https://cloud.google.com/bigquery/docs/merchant-center-transfer)

Merchant Center なんてあるのか。

## BigQuery ML – prediction with TensorFlow: beta

> To make predictions from a SQL query, you can import TensorFlow models into a BigQuery ML dataset using your Google Cloud Platform Console, the bq query CLI command, or the BigQuery API. [Documentation](https://cloud.google.com/bigquery-ml/docs/making-predictions-with-imported-tensorflow-models)

おー、ついに TensorFlow のモデル使えるようになったのかー。

# COMPUTE

## Compute Engine – compute-optimized VM instance: beta

> Now you can use compute-optimized VM instance types on Compute Engine. Designed for compute-intensive workloads, these VMs offer the highest performance per core with Intel Scalable processors (Cascade Lake) and up to 3.8 GHz of sustained all-core turbo. [Documentation](https://cloud.google.com/compute/docs/machine-types)

新しい CPU 使うようになったってこと？

## Compute Engine – guest attributes: GA

> Guest attributes are a specific type of custom metadata that your applications can both rggead from and write to while running on your instance. They work well for low-volume data and for use cases that require small amounts of data that change infrequetly. [Documentation](https://cloud.google.com/compute/docs/storing-retrieving-metadata#guest_attributes)

インスタンスから書き込めるメタデータってことか。

## App Engine Ruby 2.5 standard environment: beta

> Now you can easily build and deploy an application that can reliably run under heavy loads with large amounts of data. Your application can run in its own secure, reliable environment that’s independent of the hardware, operating system, and physical location of the server. [Documentation](https://cloud.google.com/appengine/docs/standard/ruby/)

Ruby の Standard Environment きた！！！！！ :tada:

# MANAGEMENT TOOLS

## Cloud Firestore – Stackdriver Monitoring metrics for real-time updates: beta

> This release brings two new metrics from Cloud Firestore into Stackdriver Monitoring that measure your usage of real-time updates. You can now see the number of active connections to your database and the number of snapshot listeners across all active connections. [Documentation](https://firebase.google.com/docs/firestore/monitor-usage#stackdriver-monitoring)
