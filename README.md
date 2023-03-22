# apple-mail-to-notion

Apple MailからNotionにメールを自動で追加するツール。

## environment

- macOS: venture
- node: v18.2.0
- npm: 8.9.0

## install

```shell
npm install
mkdir <temporary saving path of mail-txt>
```

## env
    
```shell
touch .env
```
[.env.sample](.env.sample)を参照

## run

```shell
npm run start
```

automatorで定期実行させることで、メールの内容を定期的にNotionに追加することができる。

