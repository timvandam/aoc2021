sum=a=>a.reduce((x,y)=>x+y,0)

f = {
  numberlist: /(\d+)/g,
  rlines: document.body.innerText.trim().split('\n'),
  lines: ()=>f.rlines.map(e=>e.trim()).filter(e=>e),
  read: (r=f.numberlist,lines=f.lines())=>lines.map(l=>[...l.matchAll(r)].map(e=>e.slice(1).map(e=>isNaN(e)?e:Number(e))).flat(Infinity)),
}

sum(Array(256).fill().reduce(([_0,_1,_2,_3,_4,_5,_6,_7,_8])=>[_1,_2,_3,_4,_5,_6,_7+_0,_8,_0],f.read()[0].reduce((c,r)=>++c[r]&&c, Array(9).fill(0))))



pipe=(start=document.body.innerText)=>(...fns)=>fns.reduce((input, fn) => fn(input), start)

getNums = txt => txt.match(/(\d+)/g).map(Number)
makeFreqArr = nums => nums.reduce((r, c) => ++r[c]&&r, Array(9).fill(0))
repeat = (times, ...fns) => (input) => { for (let i = 0; i < times; i++) input = fns.reduce((input, fn) => fn(input)||input, input); return input }
rotateLeft = (nums) => void(nums.push(nums.shift()))
rotateRight = (nums) => void(nums.unshift(nums.pop()))
sum=a=>a.reduce((x,y)=>x+y,0)
arrwithdefault=(defaultval=()=>0)=>new Proxy([], {
  get(a,i,r) {
    for (let j = a.length; j < i; j++) r[j]; // set prev defaults
    if (a[i] === undefined) {
      a[i] = defaultval()
    }
    return a[i]
  },
  set(a,i,v,r) {
    for (let j = a.length; j < i; j++) r[j]; // set prev defaults
    a[i] =v
  }
})
mat=(dims,defaultval=0)=>{
  res=[()=>defaultval]
  for (let i = 0; i < dims; i++) {
    res.push(()=>arrwithdefault(res[i]))
  }
  return res[res.length-1]()
}

result=pipe()(getNums,makeFreqArr,repeat(80,rotateLeft,(arr)=>void(arr[6]+=arr[8])),sum)
console.log(result)