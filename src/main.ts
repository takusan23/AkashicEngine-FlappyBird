import { GameMainParameterObject, RPGAtsumaruWindow } from "./parameterObject";

declare const window: RPGAtsumaruWindow;

export function main(param: GameMainParameterObject): void {
	let time = 60; // 制限時間
	if (param.sessionParameter.totalTimeLimit) {
		time = param.sessionParameter.totalTimeLimit; // セッションパラメータで制限時間が指定されたらその値を使用します
	}
	// 市場コンテンツのランキングモードでは、g.game.vars.gameState.score の値をスコアとして扱います
	g.game.vars.gameState = { score: 0 };

	// たいとる
	const titleScene = new g.Scene({
		game: g.game,
		assetIds: ["title", "play"]
	});
	titleScene.loaded.add(() => {
		const titleSprite = new g.Sprite({
			scene: titleScene,
			src: titleScene.assets["title"]
		});
		titleScene.append(titleSprite);
		// あそぶぼたん
		const playButton = new g.Sprite({
			scene: titleScene,
			src: titleScene.assets["play"]
		});
		playButton.x = (g.game.width - playButton.width) / 2;
		playButton.y = 150;
		playButton.touchable = true; // デフォで押せないので
		playButton.pointDown.add(() => {
			startGame();
		});
		titleScene.append(playButton);
	});
	g.game.pushScene(titleScene);

	const startGame = () => {
		const scene = new g.Scene({
			game: g.game,
			// このシーンで利用するアセットのIDを列挙し、シーンに通知します
			assetIds: ["tori", "result", "play"]
		});
		scene.loaded.add(() => {
			// ここからゲーム内容を記述します
			g.game.vars.gameState.score = 0;
			time = 60;

			// 背景
			const backgruondFilledRect = new g.FilledRect({
				scene: scene,
				width: g.game.width,
				height: g.game.height,
				cssColor: "white"
			});
			scene.append(backgruondFilledRect);

			// フォントの生成
			const font = new g.DynamicFont({
				game: g.game,
				fontFamily: g.FontFamily.SansSerif,
				size: 48
			});

			// スコア表示用のラベル
			const scoreLabel = new g.Label({
				scene: scene,
				text: "SCORE: 0",
				font: font,
				fontSize: font.size / 2,
				textColor: "black"
			});
			scene.append(scoreLabel);

			// スコア変更用関数
			const setScore = () => {
				scoreLabel.text = `SCORE: ${g.game.vars.gameState.score}`;
				scoreLabel.invalidate();
			};

			// プレイヤーを生成します
			const playerSprite = new g.Sprite({
				scene: scene,
				src: scene.assets["tori"],
				width: (scene.assets["tori"] as g.ImageAsset).width,
				height: (scene.assets["tori"] as g.ImageAsset).height
			});
			playerSprite.x = 100;
			playerSprite.y = 100;
			playerSprite.modified();
			scene.append(playerSprite);

			// ジャンプする関数。鉛直投げ上げの公式を使った
			const jump = () => {
				const v0 = 10; // 初速
				const gravity = 0.9; // 重力加速度
				const ground = playerSprite.y; // プレイヤーのいちにするといい感じ
				let jumpTime = 0;
				const playerPosFunc = () => {
					// 公式
					const calc = (0.5 * gravity * jumpTime * jumpTime - v0 * jumpTime + ground);
					// 下で回避するやつ絶対いるので対策
					if (playerSprite.height + calc < g.game.height && calc > 0) {
						playerSprite.y = calc;
					} else if (calc < 0) {
						playerSprite.y = 0;
					}
					jumpTime++;
					playerSprite.modified();
				};
				playerSprite.update.remove(playerPosFunc);
				playerSprite.update.add(playerPosFunc);
			};

			// 画面を押したとき
			scene.pointDownCapture.add(() => {
				if (time >= 0) {
					jump(); // ジャンプする
				}
			});

			// 終了判定
			let isEnd = false;

			/** 終了画面！ */
			const showResult = () => {
				// 遊べないように
				scene.pointDownCapture.removeAll();
				isEnd = true;
				// 終了画面
				const endSprite = new g.Sprite({
					scene: scene,
					src: scene.assets["result"]
				});
				scene.append(endSprite);
				// あそぶぼたん
				const playButton = new g.Sprite({
					scene: scene,
					src: scene.assets["play"]
				});
				playButton.x = (g.game.width - playButton.width) / 2;
				playButton.y = 150;
				playButton.touchable = true; // デフォで押せないので
				playButton.pointDown.add(() => {
					startGame();
				});
				scene.append(playButton);
				// 点数
				const pointLabel = new g.Label({
					scene: scene,
					text: `${g.game.vars.gameState.score} 点`,
					font: font,
					textColor: "black",
					fontSize: font.size / 2
				});
				pointLabel.x = (g.game.width - pointLabel.width) / 2;
				pointLabel.y = playButton.y - pointLabel.height;
				scene.append(pointLabel);
			};

			// もの
			scene.setInterval(() => {
				if (isEnd) {
					return;
				}
				const topMonoFilledRect = new g.FilledRect({
					scene: scene,
					height: 100,
					width: 50,
					cssColor: "orange"
				});
				scene.append(topMonoFilledRect);
				topMonoFilledRect.x = g.game.width + topMonoFilledRect.width;
				topMonoFilledRect.update.add(() => {
					if (time >= 0) {
						topMonoFilledRect.x -= 10;
						topMonoFilledRect.modified();
						// あたりはんてい
						if (g.Collision.intersectAreas(topMonoFilledRect, playerSprite)) {
							showResult();
						}
					}
				});
				// したも作る
				const bottomMonoFilledRect = new g.FilledRect({
					scene: scene,
					height: 100,
					width: 50,
					cssColor: "orange"
				});
				scene.append(bottomMonoFilledRect);
				bottomMonoFilledRect.x = g.game.width + bottomMonoFilledRect.width;
				bottomMonoFilledRect.y = g.game.height - bottomMonoFilledRect.height;
				bottomMonoFilledRect.update.add(() => {
					if (time >= 0) {
						bottomMonoFilledRect.x -= 10;
						bottomMonoFilledRect.modified();
						// あたりはんてい
						if (g.Collision.intersectAreas(bottomMonoFilledRect, playerSprite)) {
							showResult();
						}
					}
				});
				// 通過判定
				// したも作る
				const checkFilledRect = new g.FilledRect({
					scene: scene,
					height: g.game.height - (topMonoFilledRect.height + bottomMonoFilledRect.height), // 上の棒と下の棒の高さを足してゲームの高さで引いた値が上の棒と下の棒の間の空間
					width: 1,
					cssColor: "transparent"
				});
				scene.append(checkFilledRect);
				// ゲームの幅+棒の幅+(棒の幅-当たり判定用の幅)をしている
				checkFilledRect.x = g.game.width + bottomMonoFilledRect.width + (bottomMonoFilledRect.width - checkFilledRect.width);
				checkFilledRect.y = topMonoFilledRect.height;
				checkFilledRect.update.add(() => {
					if (time >= 0) {
						checkFilledRect.x -= 10;
						checkFilledRect.modified();
					}
					// あたりはんてい
					if (g.Collision.intersectAreas(checkFilledRect, playerSprite)) {
						checkFilledRect.destroy();
						g.game.vars.gameState.score++;
						setScore();
					}
				});
			}, 1000)

			// ここまでゲーム内容を記述します
		});
		g.game.pushScene(scene);
	};

}
