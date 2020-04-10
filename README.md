# AkashicEngine-FlappyBird

**AkashicEngine-FlappyBird**はTypeScriptとAkashicEngineで作ったあの~~イライラ~~有名なゲームです。

適当に作ったのでくっそ雑です。

ブラウザで遊べるよ。（ニコ生のゲーム作るときも使うし）

# 利用方法

 `AkashicEngine-FlappyBird` を利用するにはNode.jsが必要です。

初回のみ、以下のコマンドを実行して、ビルドに必要なパッケージをインストールしてください。
この作業は `AkashicEngine-FlappyBird` を新しく生成するごとに必要です。

```sh
npm install
```

# ビルド方法

package.jsonを書き換えて以下のコマンド一行を叩くだけでTypeScriptへの変換とサーバーの実行を同時に行えます。

```sh
npm start
```

できたら以下のアドレスをブラウザに入力すればゲームが遊べます。

```
http://localhost:3000/game/
```

# HTML形式に書き出す

```sh
akashic export html --bundle --minify --output export 
```

- --bundle
	- 一つのファイル（index.html）にまとめるときに使うオプション。
- --minify
	- JavaScriptのコードをミニファイ（ファイルサイズを小さくすること）するときに使うオプション
- --output
	- html形式で書き出すときに使うオプション。


コマンドを叩くとexportフォルダが生成されて中の`index.html`を開けば開発環境がなくても遊べるようになります。

# 書き換えて遊びたいんだけど！！

`src/main.ts`を読んでください。  
逆にそれ以外をいじると動かなくなったりするから気をつけて。

例えばここの部分。(main.tsの95行目辺り)  
重力加速度の値を増やすとすぐに落ちるようになったり  
初速の値を増やすとめっちゃ飛んだりすることができます

```ts
// ジャンプする関数。鉛直投げ上げの公式を使った
const jump = () => {
	const v0 = 10; // 初速
	const gravity = 0.9; // 重力加速度
	const ground = playerSprite.y; // プレイヤーのいちにするといい感じ
    let jumpTime = 0;
```

あとはここらへん？(main.tsの167行目辺り)  
cssColorは色です。Googleとかで「css 色 一覧」とかで調べればいっぱい出てくると思います。
heightは縦の長さです。

```ts
const topMonoFilledRect = new g.FilledRect({
	scene: scene,
	height: 100,
	width: 50,
	cssColor: "orange"
});
```