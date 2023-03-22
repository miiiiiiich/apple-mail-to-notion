![notion-sdk-typescript-starter](https://github.com/miiiiiiich/apple-mail-to-notion/actions/workflows/typecheck-prettier.yml/badge.svg)

![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![apple-script](https://img.shields.io/badge/AppleScript-999999?style=for-the-badge&logo=apple&logoColor=white)
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

## reference
- [notion-sdk-typescript-starter](https://github.com/makenotion/notion-sdk-typescript-starter)

