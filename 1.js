const one = document.body.innerText
	.split("\n")
	.map((e) => parseInt(e))
	.reduce((total, cur, i, a) => total + Number(i > 0 && a[i] > a[i - 1]), 0);

const two = document.body.innerText
	.split("\n")
	.map((e) => parseInt(e))
	.reduce((total, cur, i, a) => total + Number(i > 2 && a[i] > a[i - 3]), 0);

console.log(one, two);
