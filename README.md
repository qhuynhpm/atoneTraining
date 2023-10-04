
# ポーカー
atone試練PJTとしてのアプリケーションです！


![Logo](https://manula.s3.amazonaws.com/user/4893/img/atone-brand-logo-4c-rgb.jpg)


## 使う技術

![Static Badge](https://img.shields.io/badge/3.2.2-Ruby-b50415)

![Static Badge](https://img.shields.io/badge/7.0.8-Rails-b50415)

![Static Badge](https://img.shields.io/badge/3.6.0-Jquery-blue)

![Static Badge](https://img.shields.io/badge/20.10.22-Docker-blue)


## ローカルで実行

- PJTのクローンする

```bash
  git clone https://github.com/qhuynhpm/atoneTraining.git
```

- PJTのディレクトリに移動する

```bash
  cd Poker
```

- Dockerイメージを生成する

```bash
  docker build -t poker-rails .  
```

- Dockerコンテナを起動させる

```bash
  docker run -p 3000:3000 poker-rails
```


## デモ

![Alt Text](https://t.gyazo.com/teams/netprotections/6a286c96b909a7bfdf8aca8618cdba37.gif)


## APIの参照

#### ポーカーハンドを判断する

- **ルート**:&ensp;```POST /api/poker/check```
- **ヘッダ**:&ensp;```application/json```


-  **リクエスト**

```json
{
    "card_sets":[
        "s10　　　S1 ｓ11 s12 s13",
        "d13　 S1 h2 s3 d13",
        "s15　　　S1 ｓ11 s12 s13"
    ]
}
```

-  **レスポンス**

```json
{
    "results": [
        {
            "card_set": "s10　　　S1 ｓ11 s12 s13",
            "hand": "Royal Flush"
        },
        {
            "card_set": "d13　 S1 h2 s3 d13",
            "hand": "One Pair"
        }
    ],
    "errors": [
        {
            "card_set": "s15　　　S1 ｓ11 s12 s13",
            "msg": "1番カード指定文字が不正です. (S15)"
        }
    ]
}
```




## テストを実施

下記のコマンドで実施してください

```bash
  bundle exec rspec
```


## 更新ノート
 - ２０２３年１０月４日：　初めてリーリス
## 著者

- [@astupidduck](https://github.com/qhuynhpm)

