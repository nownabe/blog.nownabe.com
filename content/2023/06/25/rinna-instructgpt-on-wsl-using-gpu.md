---
title: "Windows 11 の WSL で GPU を使って rinna InstructGPT"
tags:
- Windows 11
- WSL
- LLM
- GPU
- rinna
- InstructGPT
- GPT
- Python
- JupyterLab
date: 2023-06-25T13:06:47+09:00
lastmod: 2023-06-25T13:06:47+09:00

draft: false
isCJKLanguage: true

image: images/2023/06/25/rinna-instructgpt.png
---

## はじめに

最近、念願のつよつよ GPU がついた PC を新調して WSL で環境構築を頑張っている。今回は GPU を使った LLM の推論を試した。

ここでの GPU は NVIDIA のもので、GPU の環境構築は WSL で CUDA を使えるようにすることを意味する。また、WSL の Distribution は Ubuntu-22.04。

LLM としては rinna 社の[日本語特化InstructGPT](https://rinna.co.jp/news/2023/05/20220531.html)を使った。

## GPU on WSL

基本的に [この手順](https://docs.nvidia.com/cuda/wsl-user-guide/index.html#getting-started-with-cuda-on-wsl) に従って進めれば WSL で GPU が使えるようになる。具体的には、Windows 11 へ WSL 対応 NVIDIA ドライバのインストール、WSL 内で CUDA Toolkit インストールの 2 点。

NVIDIA ドライバのインストールは NVIDIA の[ドライバダウンロードサイト](https://www.nvidia.com/Download/index.aspx)で Windows 11 のものを選んでダウンロードしてインストールする。最新のものであれば WSL 2 の CUDA サポートが入っている。自分の環境だとこんな感じ。

![nvidia-driver-download](/images/2023/06/25/nvidia-driver-download.png)

Windows 側でドライバをインストールすると、WSL 側でマウントしている `/usr/lib/wsl/lib` に CUDA の共有ライブラリなどが見えるようになる。

CUDA Toolkit は [ダウンロードページ](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=WSL-Ubuntu&target_version=2.0&target_type=deb_network)から WSL 用のものをインストールする。これは、Windows 側でインストールした NVIDIA ドライバが提供するファイルを上書きしないように配慮されている。自分の環境だとこんな感じ。

![install-cuda-toolkit](/images/2023/06/25/install-cuda-toolkit.png)

ただし、表示されたコマンドのまま進めると PyTorch が対応していない最新の CUDA (今だと CUDA 12.2) がインストールされてしまうので、こんな感じで対応しているバージョンをインストールする。

```bash
wget https://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/x86_64/cuda-keyring_1.0-1_all.deb
sudo dpkg -i cuda-keyring_1.0-1_all.deb
sudo apt-get update
sudo apt-get -y install cuda-11-8
```

`nvidia-smi` コマンドも使えるようになっているはずなので確認ができる。

```bash
❯ nvidia-smi
Sun Jun 25 12:15:35 2023
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.54.04              Driver Version: 536.23       CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  NVIDIA GeForce RTX 4090        On  | 00000000:01:00.0  On |                  Off |
|  0%   45C    P8              39W / 450W |   1184MiB / 24564MiB |      5%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+

+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|  No running processes found                                                           |
+---------------------------------------------------------------------------------------+
```

## InstructGPT

今回コンテナは使わず [Poetry](https://python-poetry.org/) の仮想環境で [JupyterLab](https://jupyterlab.readthedocs.io/en/latest/) を起動して、Windows のブラウザからアクセスして [rinna InstructGPT](https://huggingface.co/rinna/japanese-gpt-neox-3.6b-instruction-ppo) を使用した。

Poetry のインストールは [asdf](https://asdf-vm.com/) で。

```bash
asdf install poetry 1.5.1
asdf global poetry 1.5.1
```

適当にディレクトリを作って `poetry init`。

```bash
mkdir ~/jupyter
cd ~/jupyter
poetry init
```

`pyproject.toml` の dependencies はこんな感じ。`url` の `cp310` は Python のバージョン。

```toml
[tool.poetry.dependencies]
python = "^3.10"
jupyterlab = "^4.0.2"
torch = {url = "https://download.pytorch.org/whl/cu118/torch-2.0.1%2Bcu118-cp310-cp310-linux_x86_64.whl"}
transformers = "^4.30.2"
sentencepiece = "^0.1.99"
```

依存ライブラリをインストールして起動する。

```bash
poetry install
poetry run jupyter lab
```

Windows 側のブラウザから http://localhost:8888/ にアクセスする。トークンは JupyterLab を起動したコンソールにログとして表示されている。

まずはサンプルをそのまま動かしてみた。

```python
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("rinna/japanese-gpt-neox-3.6b-instruction-ppo", use_fast=False)
model = AutoModelForCausalLM.from_pretrained("rinna/japanese-gpt-neox-3.6b-instruction-ppo")
model = model.to("cuda")

prompt = [
    {
        "speaker": "ユーザー",
        "text": "コンタクトレンズを慣れるにはどうすればよいですか？"
    },
    {
        "speaker": "システム",
        "text": "これについて具体的に説明していただけますか？何が難しいのでしょうか？"
    },
    {
        "speaker": "ユーザー",
        "text": "目が痛いのです。"
    },
    {
        "speaker": "システム",
        "text": "分かりました、コンタクトレンズをつけると目がかゆくなるということですね。思った以上にレンズを外す必要があるでしょうか？"
    },
    {
        "speaker": "ユーザー",
        "text": "いえ、レンズは外しませんが、目が赤くなるんです。"
    }
]
prompt = [
    f"{uttr['speaker']}: {uttr['text']}"
    for uttr in prompt
]
prompt = "<NL>".join(prompt)
prompt = (
    prompt
    + "<NL>"
    + "システム: "
)

token_ids = tokenizer.encode(prompt, add_special_tokens=False, return_tensors="pt")

with torch.no_grad():
    output_ids = model.generate(
        token_ids.to(model.device),
        do_sample=True,
        max_new_tokens=128,
        temperature=0.7,
        repetition_penalty=1.1,
        pad_token_id=tokenizer.pad_token_id,
        bos_token_id=tokenizer.bos_token_id,
        eos_token_id=tokenizer.eos_token_id
    )

output = tokenizer.decode(output_ids.tolist()[0][token_ids.size(1):])
output = output.replace("<NL>", "\n")
print(output)
```

ちゃんした日本語が出力される。

```text
わかりました。コンタクトレンズを長時間つけっぱなしにしている場合は、目の周りに水ぶくれができやすくなります。また、コンタクトレンズを長時間つけたままにしておくことで、目にゴミやほこりが入りやすくなり、それらが刺激となってかゆみを引き起こすことがあります。そのため、コンタクトレンズを付ける前には必ず手を洗って、清潔な状態にすることが大切です。</s>
```

こんな関数を作っていろいろ遊んでみた。

```python
def chat(prompt):
    prompt = f"ユーザー: {prompt}<NL>システム: "
    token_ids = tokenizer.encode(prompt, add_special_tokens=False, return_tensors="pt")

    with torch.no_grad():
        output_ids = model.generate(
            token_ids.to(model.device),
            do_sample=True,
            max_new_tokens=128,
            temperature=0.7,
            repetition_penalty=1.1,
            pad_token_id=tokenizer.pad_token_id,
            bos_token_id=tokenizer.bos_token_id,
            eos_token_id=tokenizer.eos_token_id
        )

    output = tokenizer.decode(output_ids.tolist()[0][token_ids.size(1):])
    return output.replace("<NL>", "\n")
```

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Windows 11のWSL2でRTX4090使ってLLM動かせた！ <a href="https://t.co/FsbVMZ0toe">pic.twitter.com/FsbVMZ0toe</a></p>&mdash; ぎっくり腰太郎 (@nownabe) <a href="https://twitter.com/nownabe/status/1672634127374499842?ref_src=twsrc%5Etfw">June 24, 2023</a></blockquote>

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">メタルはあんま詳しくなさそう <a href="https://t.co/GTLceXCPek">https://t.co/GTLceXCPek</a> <a href="https://t.co/PtkBdkLXUB">pic.twitter.com/PtkBdkLXUB</a></p>&mdash; ぎっくり腰太郎 (@nownabe) <a href="https://twitter.com/nownabe/status/1672637461951057920?ref_src=twsrc%5Etfw">June 24, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

推論してるときのリソースはこんな感じ。

![gpu-performance](/images/2023/06/25/gpu-performance.png)

## おわりに

ローカルで LLM 動くの楽しい！