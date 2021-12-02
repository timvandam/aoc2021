const one = document.body.innerText
  .trim()
  .split("\n")
  .map((e) => e.split(" "))
  .map(([a, b]) => [a, parseInt(b)])
  .reduce(
    ([x, y], [k, d]) => [
      x + { forward: d, down: 0, up: 0 }[k],
      y + { forward: 0, down: d, up: -d }[k],
    ],
    [0, 0]
  )
  .reduce((x, y) => x * y);

const two = document.body.innerText
  .trim()
  .split("\n")
  .map((e) => e.split(" "))
  .map(([a, b]) => [a, parseInt(b)])
  .reduce(
    ([a, dt, x], [k, d]) => [
      a + { up: -d, down: d, forward: 0 }[k],
      dt + { forward: d, up: 0, down: 0 }[k],
      x + { forward: a * d, up: 0, down: 0 }[k],
    ],
    [0, 0, 0]
  )
  .slice(1)
  .reduce((dt, x) => dt * x);

console.log(one, two);
