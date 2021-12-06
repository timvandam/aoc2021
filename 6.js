sum=a=>a.reduce((x,y)=>x+y,0)

f = {
  numberlist: /(\d+)/g,
  rlines: document.body.innerText.trim().split('\n'),
  lines: ()=>f.rlines.map(e=>e.trim()).filter(e=>e),
  read: (r=f.numberlist,lines=f.lines())=>lines.map(l=>[...l.matchAll(r)].map(e=>e.slice(1).map(e=>isNaN(e)?e:Number(e))).flat(Infinity)),
}

sum(Array(256).fill().reduce(([_0,_1,_2,_3,_4,_5,_6,_7,_8])=>[_1,_2,_3,_4,_5,_6,_7+_0,_8,_0],f.read()[0].reduce((c,r)=>++c[r]&&c, Array(9).fill(0))))