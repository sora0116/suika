// import "./matter"
const { Engine, Render, Runner, Bodies, Body, Composite, Events } = Matter;

const WIDTH = 420;
const HEIGHT = 700;
const WALL_T = 10;
const DEADLINE = 6000;

const Colors = {
	0: "#ff7f7f",
	1: "#ff7fbf",
	2: "#ff7fff",
	3: "#bf7fff",
	4: "#7f7fff",
	5: "#7fbfff",
	6: "#7fffff",
	7: "#7fffbf",
	8: "#7fff7f",
	9: "#bfff7f",
	10: "#ffff7f",
}

const level = {
	1: "言.svg",
	2: "廴.svg",
	3: "正.svg",
	4: "壬.svg",
	5: "ノ.svg",
	6: "延.svg",
	7: "生.svg",
	8: "日.svg",
	9: "誕.svg",
}

// 0 + 6 => 言
// 1 + 4 => 廴
// 2 + 0 => 正
// 廴 + 正 => 延
// 言 + 延 => 誕
// 2 + 1 => 壬
// 5 + 0 => ノ
// 壬 + ノ => 生
// 6 + 1 => 日

class Game {
	engine;
	render;
	runner;
	newX;
	shadowBall;
	status;
	clevel;
	score;
	scoreboard;

	constructor(container, scoreboard) {
		this.score = 0;
		this.scoreboard = scoreboard;
		this.newX = WIDTH / 2;
		this.engine = Engine.create();
		this.render = Render.create({
			element: container,
			engine: this.engine,
			options: {
				width: WIDTH,
				height: HEIGHT,
				wireframes: false,
			}
		});
		this.runner = Runner.create();
		Render.run(this.render);
		container.addEventListener("click", this.handleClick.bind(this));
		container.addEventListener("mousemove", this.handleMousemove.bind(this));
		Events.on(this.engine, "collisionStart", this.handleCollision.bind(this));
	}

	handleClick() {
		if (this.status === "canput") {
			Composite.remove(this.engine.world, this.shadowBall);
			const r = this.clevel * 10 + 20;
			const ball = Bodies.circle(this.newX, 10 + r, r, {
				label: "ball" + this.clevel,
				render: {
					fillStyle: Colors[this.clevel]
				},
			});
			Composite.add(this.engine.world, [ball]);
			this.status = "waiting";
			setTimeout(() => { this.newShadow(); this.status = "canput"; }, 500);
		}
	}

	handleMousemove(e) {
		const { offsetX } = e;
		const r = this.clevel * 10 + 20;
		this.newX = Math.max(WALL_T + r, Math.min(WIDTH - WALL_T - r, offsetX));
		if (this.status === "canput") {
			Body.setPosition(this.shadowBall, { x: this.newX, y: this.shadowBall.position.y, });
		}
	}

	handleCollision({ pairs }) {
		for (const p of pairs) {
			const { bodyA, bodyB } = p;
			if (!Composite.get(this.engine.world, bodyA.id, "body") || !Composite.get(this.engine.world, bodyB.id, "body"))
				continue;
			if (bodyA.label === bodyB.label && bodyA.label.startsWith("ball")) {
				Composite.remove(this.engine.world, [bodyA, bodyB]);
				const x = (bodyA.position.x + bodyB.position.x) / 2
				const y = (bodyA.position.y + bodyB.position.y) / 2
				const l = Number(bodyA.label.substring(4)) + 1;
				const r = l * 10 + 20;
				const newBall = Bodies.circle(x, y, r, {
					label: "ball" + l,
					render: {
						fillStyle: Colors[l]
					}
				});
				this.setScore(this.score + l);
				Composite.add(this.engine.world, [newBall]);
			}
		}
	}

	newShadow() {
		this.clevel = Math.floor(Math.random() * 5);
		const r = this.clevel * 10 + 20;
		this.shadowBall = Bodies.circle(this.newX, 10 + r, r, {
			isStatic: true,
			collisionFilter: {
				category: "shadow"
			},
			render: {
				fillStyle: Colors[this.clevel]
			}
		});
		Composite.add(this.engine.world, [this.shadowBall]);
	}

	setScore(score) {
		this.score = score;
		this.scoreboard.replaceChildren(`Score: ${score}`);
	}

	genBall(x, y, i) {
		return Bodies.circle(x, y, this.sizes[i], {
			label: "ball" + i,
			render: {
				sprite: {
					texture: level[i]
				}
			}
		})
	}

	// construct world
	init() {
		Composite.clear(this.engine.world);
		const floor = Bodies.rectangle(WIDTH / 2, HEIGHT - WALL_T / 2, WIDTH, WALL_T, { isStatic: true, label: "wall", render: { fillStyle: "#aaa" } });
		const lwall = Bodies.rectangle(WALL_T / 2, HEIGHT / 2, WALL_T, HEIGHT, { isStatic: true, label: "wall", render: { fillStyle: "#aaa" } });
		const rwall = Bodies.rectangle(WIDTH - WALL_T / 2, HEIGHT / 2, WALL_T, HEIGHT, { isStatic: true, label: "wall", render: { fillStyle: "#aaa" } });
		Composite.add(this.engine.world, [floor, lwall, rwall]);
		this.newShadow();
		this.status = "canput";
		Runner.run(this.runner, this.engine);
	}
}

window.onload = () => {
	const container = document.querySelector(".container");
	const scoreboard = document.querySelector(".score");
	const game = new Game(container, scoreboard);
	game.init();
}