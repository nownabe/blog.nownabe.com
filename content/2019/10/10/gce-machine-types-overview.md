---
title: "GCE Machine Types Overview"
tags:
date: 2019-10-10T16:45:00+09:00
lastmod: 2019-10-10T16:45:00+09:00

draft: false
---

[GCP Updates | Semtember 30, 2019 - nownab.log](http://localhost:1313/2019/10/09/gcp-updates-semtember-30-2019/#compute-engine-name-change-for-memory-optimized-vms-ga) で
memory-optimized マシンタイプの名前が n1 から m1 に変わったという項目があったので、マシンタイプの prefix を整理してみた。

# Prefixes

## n1: 第1世代汎用マシンタイプ

* 最大 96vCPU、6.5GB/vCPU memory
* Sandy Bridge, Ivy Bridge, Haswell, Broadwell, Skylake
* 割引きが n2 よりでかい
* GPU が使える

## n2: 第2世代汎用マシンタイプ

* 最大 80vCPU
* 8GB/vCPU memory
* Cascade Lake
* 特定のリージョン、ゾーンのみ

## m1: 第1世代メモリ最適化マシンタイプ

* n1-highmem よりさらに highmem
* regional persistent disk が使えない
* 特定のリージョン、ゾーンのみ
* Broadwell, Skylake

## m2: 第2世代メモリ最適化マシンタイプ

* 長期でつかう場合は Committed use contract が必要
* 短期でつかう場合は quota の申請をする？
* Cascade Lake

## c2: 計算最適化マシンタイプ

* c1 はない
* Cascade Lake
* 基本 3.1GHz、全コアターボ 3.8GHz、1 コアターボ 3.9GHz
  * n2-highcpu は基本 2.8GHz、全コアターボ 3.4GHz、1 コアターボ 3.9GHz
* regional persistent disk が使えない
* 特定のリージョン、ゾーンのみ

## f1 / g1: Shared-core

* CPU コアを他の VM と共有



# 参考

* [Machine types  |  Compute Engine Documentation  |  Google Cloud](https://cloud.google.com/compute/docs/machine-types#m1_machine_types)
* [CPU platforms  |  Compute Engine Documentation  |  Google Cloud](https://cloud.google.com/compute/docs/cpu-platforms)
