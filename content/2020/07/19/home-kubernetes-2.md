---
title: "おうちKubernetes構築日記その2 Kubernetes構築編"
tags:
- Kubernetes
date: 2020-07-19T19:26:56+09:00
lastmod: 2020-07-19T19:26:56+09:00

draft: false
isCJKLanguage: true

image: images/2020/06/28/pi-stack.jpg
---

[前回](https://blog.nownabe.com/2020/06/28/home-kubernetes-1/)からだいぶ時間があいてしまいましたが、その2のKubernetes構築編です。
前回組み立てたマシンたちにKubernetesをインストールしました。

## あらすじ

前回はWorkerノード用のRaspberry Pi 4 8GBを4台組み立てました。
今回、それとは別のサーバを1台Control Planeとしました。

![nodes](/images/2020/06/28/nodes.png)

構築には[kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/)を使いました。

## Control Plane 構築

基本的にドキュメントに従って構築していきます。
kubeadmを使って簡単に構築できました。
kubeadmはKubernetesクラスタを構築するためのツールです。

公式ドキュメント的にはこの辺の内容になります。

* [Installing kubeadm | Kubernetes](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
* [Creating a single control-plane cluster with kubeadm | Kubernetes](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
* [Container runtimes | Kubernetes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)

今回Control Planeとして使うサーバのOSはDebian Busterです。

### ネットワーク設定

Kubernetesからiptablesでブリッジのトラフィックを制御できるようにします。

```bash
modprobe br_netfilter
cat <<EOF > /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
```

### Dockerインストール

コンテナを実行するためにDockerをインストールします。
最初はcri-oでやってみたんですが、Kubernetesの最新バージョンに対応していなかったのと、構築でエラーが出たのでさっさと諦めてDockerにしました。

ドキュメントに従ってインストールしていきます。

[Container runtimes | Kubernetes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#docker)

```bash
# 普通のDockerインストール

apt remove docker docker-engine docker.io runc
apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
apt update
apt install docker-ce docker-ce-cli containerd.io

# Dockerデーモンの設定

cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF

mkdir -p /etc/systemd/system/docker.service.d
systemctl daemon-reload
systemctl restart docker
```

`/etc/docker/daemon.json`のcgroup driverはkubeletと同じにする必要があります。
Dockerのデフォルトは`cgroupfs`ですが、kubeadmで構築するとkubeletは`systemd`に設定されるので`systemd`にあわせます。

systemdのUnitファイルにはいろいろ書いてありますが、kubeletのcgroup driverを変更する場合は`/var/lib/kubelet/config.yaml`での設定が推奨のようです。


### kubeadmインストール

kubeadm、kubelet、kubectlをインストールします。

```bash
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
echo 'deb https://apt.kubernetes.io/ kubernetes-xenial main' > /etc/apt/sources.list.d/kubernetes.list
apt update
apt install -y kubeadm kubelet kubectl
apt-mark hold kubelet kubeadm kubectl
```

### Control Plane初期化

kubeadmでControl Planeを初期化します。

```bash
kubeadm init \
  --dry-run \
  --control-plane-endpoint=kube-master.cf.nownabe.in \
  --pod-network-cidr=10.4.0.0/14 \
  --service-cidr=10.2.0.0/15 \
  --service-dns-domain "kube.cf.nownabe.in"
```

これはdry runコマンドなので、大丈夫そうなら`--dry-run`を消して実行します。
うまくいったら次のようなメッセージが表示されます。

```bash
To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of control-plane nodes by copying certificate authorities
and service account keys on each node and then running the following as root:

  kubeadm join kube-master.cf.nownabe.in:6443 --token XXXX \
    --discovery-token-ca-cert-hash sha256:XXXX \
    --control-plane

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join kube-master.cf.nownabe.in:6443 --token XXXX \
    --discovery-token-ca-cert-hash sha256:XXXX
```

Control Planeは今回この1ノードだけなので、次にやることはこの3つですね。

* 設定コピーしてkubectl使えるようにする
* Podネットワークadd-onデプロイ
* Workerノード追加

設定を`/etc/kubernetes/admin.conf`からコピーして、別のマシンから`kubectl get po`してみました。

```bash
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"13+", GitVersion:"v1.13.11-dispatcher", GitCommit:"2e298c7e992f83f47af60cf4830b11c7370f6668", GitTreeState:"clean", BuildDate:"2019-09-19T22:20:12Z", GoVersion:"go1.11.13", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"18", GitVersion:"v1.18.3", GitCommit:"2e7996e3e2712684bc73f0dec0200d64eec7fe40", GitTreeState:"clean", BuildDate:"2020-05-20T12:43:34Z", GoVersion:"go1.13.9", Compiler:"gc", Platform:"linux/amd64"}
$ kubectl get pods --all-namespaces
NAMESPACE     NAME                                         READY   STATUS              RESTARTS   AGE
kube-system   coredns-66bff467f8-7sr7t                     0/1     ContainerCreating   0          21h
kube-system   coredns-66bff467f8-sh24v                     0/1     ContainerCreating   0          21h
kube-system   etcd-sv-1.cf.nownabe.in                      1/1     Running             0          21h
kube-system   kube-apiserver-sv-1.cf.nownabe.in            1/1     Running             0          21h
kube-system   kube-controller-manager-sv-1.cf.nownabe.in   1/1     Running             0          21h
kube-system   kube-proxy-t4hgb                             1/1     Running             0          21h
kube-system   kube-scheduler-sv-1.cf.nownabe.in            1/1     Running
```

おおー、動いてますね！！ :tada:
クライアントのkubectlがやたら古いのが気になりますが、ちゃんとapiserverは動いてそうです。

## Workerノード構築

Control Planeができたので、Raspberry PiをWorkerノードとして構築してクラスタに追加していきます。

Raspberry PiにインストールしたOSはRaspberry Pi OS Busterです。

### Swap無効化

Raspberry Pi OSではデフォルトだとSwapが有効になっているので無効化します。

```bash
dphys-swapfile swapoff
systemctl stop dphys-swapfile
systemctl disable dphys-swapfile
```

### いろいろ

Dockerインストールしたりkubeadmインストールしたりします。
ここはControl Planeとほぼ同じなのでコマンドだけ。

```bash
modprobe br_netfilter
modprobe overlay
cat <<EOF > /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
sysctl --system

apt remove docker docker-engine docker.io runc
curl -fsSL get.docker.com | sh
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF
systemctl restart docker

apt install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF > /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt update
apt install -y kubeadm kubelet kubectl
apt-mark hold kubelet kubeadm kubectl
```

### Workerノード初期化

kubeadmで初期化し、クラスタに参加します。
Control Planeをkubeadmで初期化したときに表示されたコマンドを実行するだけです。

```bash
kubeadm join kube-master.cf.nownabe.in:6443 --token XXXX \
    --discovery-token-ca-cert-hash sha256:XXXX
```

もしトークンの期限が切れていてエラーになる場合は、Control Planeでトークンを再発行します。

```bash
kubeadm token create --print-join-command
```

トークンの一覧もコマンドで確認できます。

```bash
kubeadm token list
```

[kubeadm token | Kubernetes](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-token/)

無事実行できたら、kubectlで確認してみましょう。
ちゃんと追加されてますね！やった！ :clap:

```bash
$ kubectl get nodes --output wide
NAME                          STATUS   ROLES    AGE   VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION   CONTAINER-RUNTIME
kube-worker-1.cf.nownabe.in   Ready    <none>   31d   v1.18.5   10.0.1.101    <none>        Raspbian GNU/Linux 10 (buster)   4.19.118-v8+     docker://19.3.12
kube-worker-2.cf.nownabe.in   Ready    <none>   30d   v1.18.4   10.0.1.102    <none>        Raspbian GNU/Linux 10 (buster)   4.19.118-v8+     docker://19.3.11
kube-worker-3.cf.nownabe.in   Ready    <none>   23d   v1.18.4   10.0.1.103    <none>        Raspbian GNU/Linux 10 (buster)   4.19.118-v8+     docker://19.3.12
kube-worker-4.cf.nownabe.in   Ready    <none>   23d   v1.18.4   10.0.1.104    <none>        Raspbian GNU/Linux 10 (buster)   4.19.118-v8+     docker://19.3.12
sv-1.cf.nownabe.in            Ready    master   31d   v1.18.3   10.0.1.1      <none>        Debian GNU/Linux 10 (buster)     4.19.0-9-amd64   docker://19.3.11
```

## flannel インストール

最後にNetwork Add-onとしてflannelをインストールしました。
最初にCalico、次にCiliumをインストールしようとしたんですが上手く行かずにflannelになりました。
調べてからインストールすればよかったんですが、Armの64bitに対応できてませんでした。

flannelのインストールは公式で用意されているマニフェストYAMLをapplyでOKです。

```bash
curl -O https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
kubectl apply -f kube-flannel.yml
```

するとこんな感じでDaemon Setとしてflannelがデプロイされます。

```bash
$ kubectl get po --output wide --all-namespaces
NAMESPACE     NAME                                         READY   STATUS    RESTARTS   AGE   IP           NODE                          NOMINATED NODE   READINESS GATES
kube-system   coredns-66bff467f8-8dspl                     1/1     Running   0          20d   10.4.4.2     kube-worker-3.cf.nownabe.in   <none>           <none>
kube-system   coredns-66bff467f8-vfx8d                     1/1     Running   0          30d   10.4.2.2     kube-worker-2.cf.nownabe.in   <none>           <none>
kube-system   etcd-sv-1.cf.nownabe.in                      1/1     Running   0          31d   10.0.1.1     sv-1.cf.nownabe.in            <none>           <none>
kube-system   kube-apiserver-sv-1.cf.nownabe.in            1/1     Running   0          31d   10.0.1.1     sv-1.cf.nownabe.in            <none>           <none>
kube-system   kube-controller-manager-sv-1.cf.nownabe.in   1/1     Running   193        31d   10.0.1.1     sv-1.cf.nownabe.in            <none>           <none>
kube-system   kube-flannel-ds-amd64-dpw88                  1/1     Running   10         31d   10.0.1.1     sv-1.cf.nownabe.in            <none>           <none>
kube-system   kube-flannel-ds-arm-mld8c                    1/1     Running   0          23d   10.0.1.104   kube-worker-4.cf.nownabe.in   <none>           <none>
kube-system   kube-flannel-ds-arm-q2z9v                    1/1     Running   0          31d   10.0.1.101   kube-worker-1.cf.nownabe.in   <none>           <none>
kube-system   kube-flannel-ds-arm-qfqcs                    1/1     Running   2          23d   10.0.1.103   kube-worker-3.cf.nownabe.in   <none>           <none>
kube-system   kube-flannel-ds-arm-wgg4d                    1/1     Running   2          30d   10.0.1.102   kube-worker-2.cf.nownabe.in   <none>           <none>
kube-system   kube-proxy-429jm                             1/1     Running   0          31d   10.0.1.1     sv-1.cf.nownabe.in            <none>           <none>
kube-system   kube-proxy-55tgl                             1/1     Running   0          23d   10.0.1.104   kube-worker-4.cf.nownabe.in   <none>           <none>
kube-system   kube-proxy-f4msl                             1/1     Running   0          23d   10.0.1.103   kube-worker-3.cf.nownabe.in   <none>           <none>
kube-system   kube-proxy-fp6d2                             1/1     Running   0          30d   10.0.1.102   kube-worker-2.cf.nownabe.in   <none>           <none>
kube-system   kube-proxy-hntn9                             1/1     Running   0          31d   10.0.1.101   kube-worker-1.cf.nownabe.in   <none>           <none>
kube-system   kube-scheduler-sv-1.cf.nownabe.in            1/1     Running   190        31d   10.0.1.1     sv-1.cf.nownabe.in            <none>           <none>
```

1ヶ月ブログ書くの先延ばしにしてたこともばっちりわかって素晴らしいですね :raised_hands:

## おわりに

Kubernetes構築編は以上です。
無事にKubernetesが構築できて満足です :satisfied:

Networkに関してはflannelだけだとNetwork Policyが使えないので、またそのうちなんとかしたいと思います。

次からはいろいろ機能追加していきたいので、まずはGitOpsですかねー。
