---
title: "GCE Machine Types Overview"
tags:
date: 2019-10-10T16:45:00+09:00
lastmod: 2019-10-10T16:45:00+09:00

draft: false
isCJKLanguage: true
---

[GCP Updates | Semtember 30, 2019 - nownab.log](http://localhost:1313/2019/10/09/gcp-updates-semtember-30-2019/#compute-engine-name-change-for-memory-optimized-vms-ga) で
memory-optimized マシンタイプの名前がn1からm1に変わったという項目があったので、マシンタイプのprefixを整理してみた。

# Prefixes

## n1: 第1世代汎用マシンタイプ

* 最大96vCPU、6.5GB/vCPU memory
* Sandy Bridge, Ivy Bridge, Haswell, Broadwell, Skylake
* 割引きがn2よりでかい
* GPUが使える

## n2: 第2世代汎用マシンタイプ

* 最大80vCPU
* 8GB/vCPU memory
* Cascade Lake
* 特定のリージョン、ゾーンのみ

## m1: 第1世代メモリ最適化マシンタイプ

* n1-highmemよりさらにhighmem
* regional persistent diskが使えない
* 特定のリージョン、ゾーンのみ
* Broadwell, Skylake

## m2: 第2世代メモリ最適化マシンタイプ

* 長期でつかう場合はCommitted use contractが必要
* 短期でつかう場合はquotaの申請をする？
* Cascade Lake

## c2: 計算最適化マシンタイプ

* c1はない
* Cascade Lake
* 基本3.1GHz、全コアターボ3.8GHz、1コアターボ3.9GHz
  * n2-highcpuは基本2.8GHz、全コアターボ3.4GHz、1コアターボ3.9GHz
* regional persistent diskが使えない
* 特定のリージョン、ゾーンのみ

## f1 / g1: Shared-core

* CPUコアを他のVMと共有



# 参考

* [Machine types  |  Compute Engine Documentation  |  Google Cloud](https://cloud.google.com/compute/docs/machine-types#m1_machine_types)
* [CPU platforms  |  Compute Engine Documentation  |  Google Cloud](https://cloud.google.com/compute/docs/cpu-platforms)
