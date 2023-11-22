const WIDTH = 500
const HEIGHT = 800

const { Engine, Render, Runner, Bodies, Composite } = Matter;

class Game {
	engine;
	render;
	runner;
	constructor(container) {
		this.engine = Engine.create();
		this.render = Render.create({
			element: container,
			engine: this.engine,
			options: {
				width: WIDTH,
				height: HEIGHT,
				// wireframes: false
			}
		});
		this.runner = Runner.create();
		Render.run(this.render);
		Runner.run(this.runner, this.engine);
		container.addEventListener("click", this.addBall.bind(this));
	}

	addBall() {
		const ball = Bodies.circle(WIDTH / 2, 20, 10);
		Composite.add(this.engine.world, [ball]);
	}

	init() {
		const floor = Bodies.rectangle(WIDTH / 2, HEIGHT - 15, WIDTH, 10, {
			isStatic: true,
		});
		const lwall = Bodies.rectangle(5, HEIGHT / 2, 10, HEIGHT, {
			isStatic: true
		})
		const rwall = Bodies.rectangle(WIDTH - 5, HEIGHT / 2, 10, HEIGHT, {
			isStatic: true
		})
		Composite.add(this.engine.world, [floor, lwall, rwall]);
	}
}

window.onload = () => {
	const container = document.querySelector(".container");
	const game = new Game(container);
	game.init();
}