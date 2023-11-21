// aliases
const Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Constraint = Matter.Constraint,
	Body = Matter.Body,
	Bodies = Matter.Bodies,
	Composite = Matter.Composite

const engine = Engine.create()
const render = Render.create({
	element: document.body,
	engine: engine,
})

/* ここにコードを追加していく */
const ball = Bodies.circle(100, 20, 50);
Composite.add(engine.world, [ball]);

const floor = Bodies.rectangle(100, 300, 100, 10, {
	isStatic: true,
	label: "ground",
	angle: 10
});
Composite.add(engine.world, [floor]);

Engine.run(engine)
Render.run(render)

