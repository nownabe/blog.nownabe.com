---
title: "Raspberry Pi 4 のベンチマーク"
tags:
- Raspberry Pi
- Raspberry Pi 3
- Raspberry Pi 4
- benchmark
- UnixBench
- fio
date: 2020-07-04T19:43:02+09:00
lastmod: 2020-07-04T19:43:02+09:00

draft: false
isCJKLanguage: true

image: images/2020/07/04/fio.png
---

Raspberry Pi 4 の各種ベンチマークを取ってみました。
UnixBenchとfioです。
雑にほぼデフォルト設定で計測ました。
チューニング等もまったくしてません。

Raspberry Pi 4 の生の結果は最後にまとめて貼っておきます。

## 比較対象

何かしら比較対象がほしかったので、この辺りを使いました。

| マシン | CPU | Memory | Disk 1 | Disk 2 | OS | Kernel |
|---|---|---|---|---|---|---|
| [Raspberry Pi 4 Model B](https://amzn.to/2NS7WCG) | Arm Cortex-A72 1.5GHz 4 cores | 8GB | [Samsung EVO Plus 512GB microSDXC](https://amzn.to/3dVGkaE) | - | Raspberry OS buster | Linux 4.19.118 |
| [Raspberry Pi 3 Model B](https://amzn.to/2ZtDG6w) | Arm Cortex-A53 1.2GHz 4 cores | 1GB | [Kingston microSDHC 16GB](https://amzn.to/3gqyuaq) | - | Raspberry OS | ? |
| Server | [Core i3-2100T 2.5GHz 2 cores 4 threads](https://amzn.to/3grgxsw) | 16GB | WD SATA 1TB | - | Debian buster | Linux 4.19.0 |
| Desktop PC | [Core i7-8700K 3.7GHz 6 cores 12 threads](https://amzn.to/3eTKfG6) | 64GB | [CFD SATA3.0 NAND SSD 240GB](https://amzn.to/2NVY4rS) | [WD Blue SATA3.0 5400rpm 4TB](https://amzn.to/31JSHnO) | Ubuntu 19.10 | Linux 5.3.0 |

注意点として、Raspberry Pi 4は多分電力が足りてません。[^1]

[^1]: [おうちKubernetes構築日記その1 Raspberry Pi編 - nownab.log](https://blog.nownabe.com/2020/06/28/home-kubernetes-1/#%E6%9D%90%E6%96%99)

## UnixBench

### セットアップ

```bash
sudo apt install git
git clone https://github.com/kdlucas/byte-unixbench
cd byte-unixbench/UnixBench
./Run
```

### 結果

Raspberry Pi 3に比べるとだいぶ良い結果が出てますね。
System Call Overheadだけなぜか負けてます。

一番お金かかってるデスクトップPCが圧倒的に勝ってて安心しました。

グラフはIndex Scoreです。

![UnixBench Single Core](/images/2020/07/04/unix_bench_single.png)
![UnixBench Multi Core](/images/2020/07/04/unix_bench_multi.png)

## fio

### セットアップ

```bash
sudo apt install libaio-dev fio
```

fioのバージョンは3.12。

### 設定

```txt
[sequential_read]
rw=read
size=1g
ioengine=libaio
direct=1
group_reporting

[sequential_write]
rw=write
size=1g
ioengine=libaio
direct=1
group_reporting

[random_read]
rw=randread
size=1g
ioengine=libaio
direct=1
group_reporting

[random_write]
rw=randwrite
size=1g
ioengine=libaio
direct=1
group_reporting
```

### 結果

今回Evo PlusというそこそこいいSDカードを使ってますが、Seqeuntial、RandomともにReadが2500IOPS、Writeが600IPS程度でした。

Raspberry Pi 3 は遅すぎたので計測してません。

![fio](/images/2020/07/04/fio.png)

## ログ

以下、Raspberry Pi 4の計測ログです。

### UnixBench

```txt
========================================================================
   BYTE UNIX Benchmarks (Version 5.1.3)

   System: raspberrypi: GNU/Linux
   OS: GNU/Linux -- 4.19.118-v8+ -- #1311 SMP PREEMPT Mon Apr 27 14:32:38 BST 2020
   Machine: aarch64 (unknown)
   Language: en_US.utf8 (charmap="ANSI_X3.4-1968", collate="ANSI_X3.4-1968")
   15:04:13 up  1:53,  1 user,  load average: 0.15, 0.04, 0.04; runlevel Jul

------------------------------------------------------------------------
Benchmark Run: Fri Jul 03 2020 15:04:13 - 15:32:03
4 CPUs in system; running 1 parallel copy of tests

Dhrystone 2 using register variables       10044316.9 lps   (10.0 s, 7 samples)
Double-Precision Whetstone                     2384.8 MWIPS (9.6 s, 7 samples)
Execl Throughput                               1475.8 lps   (30.0 s, 2 samples)
File Copy 1024 bufsize 2000 maxblocks        181135.5 KBps  (30.0 s, 2 samples)
File Copy 256 bufsize 500 maxblocks           53422.1 KBps  (30.0 s, 2 samples)
File Copy 4096 bufsize 8000 maxblocks        482507.3 KBps  (30.0 s, 2 samples)
Pipe Throughput                              315057.3 lps   (10.0 s, 7 samples)
Pipe-based Context Switching                  50713.4 lps   (10.0 s, 7 samples)
Process Creation                               2397.1 lps   (30.0 s, 2 samples)
Shell Scripts (1 concurrent)                   3494.7 lpm   (60.0 s, 2 samples)
Shell Scripts (8 concurrent)                   1011.6 lpm   (60.0 s, 2 samples)
System Call Overhead                         276956.8 lps   (10.0 s, 7 samples)

System Benchmarks Index Values               BASELINE       RESULT    INDEX
Dhrystone 2 using register variables         116700.0   10044316.9    860.7
Double-Precision Whetstone                       55.0       2384.8    433.6
Execl Throughput                                 43.0       1475.8    343.2
File Copy 1024 bufsize 2000 maxblocks          3960.0     181135.5    457.4
File Copy 256 bufsize 500 maxblocks            1655.0      53422.1    322.8
File Copy 4096 bufsize 8000 maxblocks          5800.0     482507.3    831.9
Pipe Throughput                               12440.0     315057.3    253.3
Pipe-based Context Switching                   4000.0      50713.4    126.8
Process Creation                                126.0       2397.1    190.2
Shell Scripts (1 concurrent)                     42.4       3494.7    824.2
Shell Scripts (8 concurrent)                      6.0       1011.6   1685.9
System Call Overhead                          15000.0     276956.8    184.6
                                                                   ========
System Benchmarks Index Score                                         413.0

------------------------------------------------------------------------
Benchmark Run: Fri Jul 03 2020 15:32:03 - 15:59:55
4 CPUs in system; running 4 parallel copies of tests

Dhrystone 2 using register variables       40160712.8 lps   (10.0 s, 7 samples)
Double-Precision Whetstone                     9531.8 MWIPS (9.5 s, 7 samples)
Execl Throughput                               4203.8 lps   (30.0 s, 2 samples)
File Copy 1024 bufsize 2000 maxblocks        288344.1 KBps  (30.0 s, 2 samples)
File Copy 256 bufsize 500 maxblocks           85784.9 KBps  (30.0 s, 2 samples)
File Copy 4096 bufsize 8000 maxblocks        707436.9 KBps  (30.0 s, 2 samples)
Pipe Throughput                             1255488.7 lps   (10.0 s, 7 samples)
Pipe-based Context Switching                 196997.0 lps   (10.0 s, 7 samples)
Process Creation                               7350.2 lps   (30.0 s, 2 samples)
Shell Scripts (1 concurrent)                   8076.0 lpm   (60.0 s, 2 samples)
Shell Scripts (8 concurrent)                   1090.8 lpm   (60.1 s, 2 samples)
System Call Overhead                        1070133.2 lps   (10.0 s, 7 samples)

System Benchmarks Index Values               BASELINE       RESULT    INDEX
Dhrystone 2 using register variables         116700.0   40160712.8   3441.4
Double-Precision Whetstone                       55.0       9531.8   1733.0
Execl Throughput                                 43.0       4203.8    977.6
File Copy 1024 bufsize 2000 maxblocks          3960.0     288344.1    728.1
File Copy 256 bufsize 500 maxblocks            1655.0      85784.9    518.3
File Copy 4096 bufsize 8000 maxblocks          5800.0     707436.9   1219.7
Pipe Throughput                               12440.0    1255488.7   1009.2
Pipe-based Context Switching                   4000.0     196997.0    492.5
Process Creation                                126.0       7350.2    583.3
Shell Scripts (1 concurrent)                     42.4       8076.0   1904.7
Shell Scripts (8 concurrent)                      6.0       1090.8   1818.0
System Call Overhead                          15000.0    1070133.2    713.4
                                                                   ========
System Benchmarks Index Score                                        1056.0
```

### fio

```txt
$ fio sequential_read.fio
sequential_read: (g=0): rw=read, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=1
fio-3.12
Starting 1 process
Jobs: 1 (f=1): [R(1)][100.0%][r=11.5MiB/s][r=2938 IOPS][eta 00m:00s]
sequential_read: (groupid=0, jobs=1): err= 0: pid=2885: Fri Jul  3 17:40:44 2020
  read: IOPS=2980, BW=11.6MiB/s (12.2MB/s)(1024MiB/87960msec)
    slat (usec): min=33, max=171, avg=64.53, stdev=12.05
    clat (usec): min=173, max=20162, avg=260.20, stdev=42.60
     lat (usec): min=245, max=20201, avg=326.99, stdev=46.23
    clat percentiles (usec):
     |  1.00th=[  229],  5.00th=[  241], 10.00th=[  245], 20.00th=[  249],
     | 30.00th=[  253], 40.00th=[  258], 50.00th=[  262], 60.00th=[  265],
     | 70.00th=[  269], 80.00th=[  269], 90.00th=[  281], 95.00th=[  281],
     | 99.00th=[  285], 99.50th=[  293], 99.90th=[  326], 99.95th=[  334],
     | 99.99th=[  355]
   bw (  KiB/s): min=11272, max=14344, per=100.00%, avg=11920.73, stdev=485.76, samples=175
   iops        : min= 2818, max= 3586, avg=2980.18, stdev=121.44, samples=175
  lat (usec)   : 250=21.51%, 500=78.48%, 750=0.01%
  lat (msec)   : 2=0.01%, 4=0.01%, 10=0.01%, 50=0.01%
  cpu          : usr=4.45%, sys=14.76%, ctx=524478, majf=0, minf=23
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=262144,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=11.6MiB/s (12.2MB/s), 11.6MiB/s-11.6MiB/s (12.2MB/s-12.2MB/s), io=1024MiB (1074MB), run=87960-87960msec

Disk stats (read/write):
  mmcblk0: ios=261954/17, merge=0/4, ticks=77219/147, in_queue=76448, util=86.89%

$ fio sequential_write.fio
sequential_write: (g=0): rw=write, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=1
fio-3.12
Starting 1 process
Jobs: 1 (f=1): [W(1)][100.0%][w=2530KiB/s][w=632 IOPS][eta 00m:00s]
sequential_write: (groupid=0, jobs=1): err= 0: pid=2906: Fri Jul  3 17:47:38 2020
  write: IOPS=643, BW=2573KiB/s (2635kB/s)(1024MiB/407490msec); 0 zone resets
    slat (usec): min=41, max=3885, avg=90.60, stdev=12.75
    clat (usec): min=234, max=30675, avg=1450.39, stdev=687.41
     lat (usec): min=706, max=30723, avg=1543.73, stdev=688.03
    clat percentiles (usec):
     |  1.00th=[  701],  5.00th=[  775], 10.00th=[  791], 20.00th=[  857],
     | 30.00th=[  947], 40.00th=[ 1270], 50.00th=[ 1336], 60.00th=[ 1418],
     | 70.00th=[ 1811], 80.00th=[ 1876], 90.00th=[ 1909], 95.00th=[ 1975],
     | 99.00th=[ 3884], 99.50th=[ 3884], 99.90th=[ 3949], 99.95th=[ 7570],
     | 99.99th=[12649]
   bw (  KiB/s): min= 2480, max= 3616, per=100.00%, avg=2573.18, stdev=128.26, samples=814
   iops        : min=  620, max=  904, avg=643.29, stdev=32.06, samples=814
  lat (usec)   : 250=0.01%, 750=3.62%, 1000=26.62%
  lat (msec)   : 2=65.39%, 4=4.28%, 10=0.05%, 20=0.04%, 50=0.01%
  cpu          : usr=1.30%, sys=4.11%, ctx=525790, majf=0, minf=26
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,262144,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
  WRITE: bw=2573KiB/s (2635kB/s), 2573KiB/s-2573KiB/s (2635kB/s-2635kB/s), io=1024MiB (1074MB), run=407490-407490msec

Disk stats (read/write):
  mmcblk0: ios=0/262249, merge=0/81, ticks=0/392373, in_queue=388416, util=95.27%

$ fio random_read.fio
random_read: (g=0): rw=randread, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=1
fio-3.12
Starting 1 process
Jobs: 1 (f=0): [f(1)][100.0%][r=9849KiB/s][r=2462 IOPS][eta 00m:00s]
random_read: (groupid=0, jobs=1): err= 0: pid=2948: Fri Jul  3 17:50:27 2020
  read: IOPS=2453, BW=9813KiB/s (10.0MB/s)(1024MiB/106851msec)
    slat (usec): min=36, max=451, avg=70.23, stdev=11.65
    clat (usec): min=132, max=1188, avg=324.00, stdev=13.82
     lat (usec): min=245, max=1429, avg=396.66, stdev=22.00
    clat percentiles (usec):
     |  1.00th=[  289],  5.00th=[  302], 10.00th=[  310], 20.00th=[  314],
     | 30.00th=[  318], 40.00th=[  322], 50.00th=[  326], 60.00th=[  326],
     | 70.00th=[  330], 80.00th=[  338], 90.00th=[  343], 95.00th=[  343],
     | 99.00th=[  347], 99.50th=[  351], 99.90th=[  371], 99.95th=[  383],
     | 99.99th=[  424]
   bw (  KiB/s): min= 9516, max=11528, per=99.96%, avg=9808.85, stdev=357.16, samples=213
   iops        : min= 2379, max= 2882, avg=2452.24, stdev=89.29, samples=213
  lat (usec)   : 250=0.11%, 500=99.89%, 750=0.01%, 1000=0.01%
  lat (msec)   : 2=0.01%
  cpu          : usr=4.29%, sys=13.33%, ctx=524445, majf=0, minf=22
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=262144,0,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
   READ: bw=9813KiB/s (10.0MB/s), 9813KiB/s-9813KiB/s (10.0MB/s-10.0MB/s), io=1024MiB (1074MB), run=106851-106851msec

Disk stats (read/write):
  mmcblk0: ios=261589/0, merge=0/0, ticks=94558/0, in_queue=91684, util=85.93%

$ fio random_write.fio
random_write: (g=0): rw=randwrite, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=1
fio-3.12
Starting 1 process
Jobs: 1 (f=1): [w(1)][100.0%][w=2574KiB/s][w=643 IOPS][eta 00m:00s]
random_write: (groupid=0, jobs=1): err= 0: pid=2952: Fri Jul  3 17:57:46 2020
  write: IOPS=632, BW=2530KiB/s (2591kB/s)(1024MiB/414491msec); 0 zone resets
    slat (usec): min=41, max=4332, avg=91.16, stdev=15.87
    clat (usec): min=579, max=88041, avg=1474.56, stdev=1151.84
     lat (usec): min=707, max=88136, avg=1568.45, stdev=1152.45
    clat percentiles (usec):
     |  1.00th=[  701],  5.00th=[  775], 10.00th=[  791], 20.00th=[  857],
     | 30.00th=[  963], 40.00th=[ 1270], 50.00th=[ 1336], 60.00th=[ 1418],
     | 70.00th=[ 1811], 80.00th=[ 1876], 90.00th=[ 1909], 95.00th=[ 1975],
     | 99.00th=[ 3884], 99.50th=[ 3884], 99.90th=[11469], 99.95th=[30802],
     | 99.99th=[32375]
   bw (  KiB/s): min= 2096, max= 3576, per=100.00%, avg=2529.50, stdev=147.52, samples=828
   iops        : min=  524, max=  894, avg=632.35, stdev=36.88, samples=828
  lat (usec)   : 750=3.66%, 1000=26.42%
  lat (msec)   : 2=65.52%, 4=4.25%, 10=0.02%, 20=0.05%, 50=0.07%
  lat (msec)   : 100=0.01%
  cpu          : usr=1.35%, sys=4.12%, ctx=525780, majf=0, minf=21
  IO depths    : 1=100.0%, 2=0.0%, 4=0.0%, 8=0.0%, 16=0.0%, 32=0.0%, >=64=0.0%
     submit    : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     complete  : 0=0.0%, 4=100.0%, 8=0.0%, 16=0.0%, 32=0.0%, 64=0.0%, >=64=0.0%
     issued rwts: total=0,262144,0,0 short=0,0,0,0 dropped=0,0,0,0
     latency   : target=0, window=0, percentile=100.00%, depth=1

Run status group 0 (all jobs):
  WRITE: bw=2530KiB/s (2591kB/s), 2530KiB/s-2530KiB/s (2591kB/s-2591kB/s), io=1024MiB (1074MB), run=414491-414491msec

Disk stats (read/write):
  mmcblk0: ios=0/262251, merge=0/83, ticks=0/398727, in_queue=393828, util=94.97%
```
