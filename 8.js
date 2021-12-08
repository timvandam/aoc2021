pipe=(start=document.body.innerText)=>(...fns)=>fns.reduce((input, fn) => fn(input), start)
function permutator(inputArr) {
    var results = [];
  
    function permute(arr, memo) {
      var cur, memo = memo || [];
  
      for (var i = 0; i < arr.length; i++) {
        cur = arr.splice(i, 1);
        if (arr.length === 0) {
          results.push(memo.concat(cur));
        }
        permute(arr.slice(), memo.concat(cur));
        arr.splice(i, 0, cur[0]);
      }
  
      return results;
    }
  
    return permute(inputArr);
  }
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
imat=(dims,defaultval=0)=>{
  res=[()=>defaultval]
  for (let i = 0; i < dims; i++) {
    res.push(()=>arrwithdefault(res[i]))
  }
  return res[res.length-1]()
}
mat = (dims,fill=()=>0) => dims.length === 1 ? Array(dims[0]).fill(fill()):Array.from({length:dims.splice(-1)}, () => mat(dims,fill))
zip = (a,...r)=> a.map((a,i)=>[a,...r.map(r=>r[i])])
rng = (f, t) => Array.from({length:Math.abs(f-t)+1},(_,i)=>f+i*(f<t?1:-1))
repeat=(arr,cnt)=>Array.from({length:cnt},()=>[...arr]).flat(1)
forcelen=(arr,len)=>repeat(arr,Math.ceil(len/arr.length)).slice(0, len)

f = {
  numberlist: /(\d+)/g,
  number: /(\d+)$/g,
  digits: /(\d)/g,
  rlines: document.body.innerText.trim().split('\n'),
  lines: ()=>f.rlines.map(e=>e.trim()).filter(e=>e),
  read: (r=f.numberlist,lines=f.lines())=>lines.map(l=>[...l.matchAll(r)].map(e=>e.slice(1).map(e=>isNaN(e)?e:Number(e))).flat(Infinity)),
  // reads matrix based on given size (height)
  readmatsCS: (size,lines=f.lines()) => f.read(f.numberlist,lines).reduce((mats, row, i, a) => i%size==0?[...mats,Array.from({length:size},(_,j)=>a[i + j])]:mats, []),
  // reads matrix based on empty lines
  readmatsEL: (lines=f.rlines) => lines.reduce((r, line) => line.trim().length ? [r, r[1].push([...line.matchAll(f.numberlist)].map(e=>e.slice(1).map(e=>isNaN(e)?e:Number(e))).flat(Infinity))][0] : [r, r[0].push(r[1]), r[1] = []][0], [[], []])[0]
}

b=document.body.innerText
b=`
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`
lines=b.trim().split('\n').map(e=>e.match(/(\w+)/g))
dmap={
    0: 'abcefg',
    1: 'cf',
    2: 'acdeg',
    3: 'acdfg',
    4: 'bcdf',
    5: 'abdfg',
    6: 'abdefg',
    7: 'acf',
    8: 'abcdefg',
    9: 'abcdfg',
}
dmapi={
    'abcefg': 0,
    'cf': 1,
    'acdeg': 2,
    'acdfg': 3,
    'bcdf': 4,
    'abdfg': 5,
    'abdefg': 6,
    'acf': 7,
    'abcdefg': 8,
    'abcdfg': 9,
}
s = str => [...str].sort().join('')
Object.keys(dmap).forEach(k => dmap[k] = s(dmap[k]))



defaultmapping = () => ({
    a: [...'abcdefg'], // coded to non coded
    b: [...'abcdefg'],
    c: [...'abcdefg'],
    d: [...'abcdefg'],
    e: [...'abcdefg'],
    f: [...'abcdefg'],
    g: [...'abcdefg'],
})

freq={
    a:8,
   b:6, // *
   c:8,
   d: 7,
   e:4, // *
   f:9, // *
   g:7
}

// count = 0
// for (const line of lines) {
//     digits = line.slice(0, 10)
//     display = line.slice(10)
//     mapping = defaultmapping()
//     remchars = [...'abcdefg']

//     digitFreqs = digits.reduce((obj, digit) => {
//         for (const d of digit) {
//             obj[d]++
//         }
//         return obj
//     }, {a:0,b:0,c:0,d:0,e:0,f:0})

//     for (const d of 'abcdefg') {
//         if (digitFreqs[d] === 6) {
//             // `d` maps to b
//             mapsto='b'
//             mapping[d] = [mapsto]
//             remchars = remchars.filter(c=>c!==d)
//             for (const x of remchars) {
//                 mapping[x] = mapping[x].filter(c => c!==mapsto)
//             }
//         } else if (digitFreqs[d] === 4) {
//             // `d` maps to e
//             mapsto='e'
//             mapping[d] = [mapsto]
//             remchars = remchars.filter(c=>c!==d)
//             for (const x of remchars) {
//                 mapping[x] = mapping[x].filter(c => c!==mapsto)
//             }
//         } else if (digitFreqs[d] === 9) {
//             // `d` maps to f
//             mapsto='f'
//             mapping[d] = [mapsto]
//             remchars = remchars.filter(c=>c!==d)
//             for (const x of remchars) {
//                 mapping[x] = mapping[x].filter(c => c!==mapsto)
//             }
//         }
//     }

//     for (let i = 0; i < digits.length; i++) {
//         digit = digits[i];
//         if (digit.length === 2) {
//             // its 1
//             possible = 'cf'
//             notpossible = [...'abcdefg'].filter(c=>!possible.includes(c))
//             otherdigits = [...'abcdefg'].filter(c=>!digit.includes(c))
//             for (const char of digit) {
//                 // these dont appear in 1
//                 mapping[char] = mapping[char].filter(c => possible.includes(c))
//             }
//             // only `digit` can map to cf. the others can not
//             for (const char of otherdigits) {
//                 mapping[char] = mapping[char].filter(c => notpossible.includes(c))
//             }
//         } else if (digit.length === 3) {
//             // its 7
//             possible = 'acf'
//             notpossible = [...'abcdefg'].filter(c=>!possible.includes(c))
//             otherdigits = [...'abcdefg'].filter(c=>!digit.includes(c))
//             for (const char of digit) {
//                 // these dont appear in 1
//                 mapping[char] = mapping[char].filter(c => possible.includes(c))
//             }
//             // only `digit` can map to cf. the others can not
//             for (const char of otherdigits) {
//                 mapping[char] = mapping[char].filter(c => notpossible.includes(c))
//             }
//         } else if (digit.length === 4) {
//             // its 4
//             possible = 'bcdf'
//             notpossible = [...'abcdefg'].filter(c=>!possible.includes(c))
//             otherdigits = [...'abcdefg'].filter(c=>!digit.includes(c))
//             for (const char of digit) {
//                 // these dont appear in 1
//                 mapping[char] = mapping[char].filter(c => possible.includes(c))
//             }
//             // only `digit` can map to cf. the others can not
//             for (const char of otherdigits) {
//                 mapping[char] = mapping[char].filter(c => notpossible.includes(c))
//             }
//         } else if (digit.length === 7) {
//             // its 8
//         } else if (digit.length === 6) {
//             // its either 9 or 6 or 0
//         } else if (digit.length === 5) {
//             // its either 2 or 3 or 5
//         }

//         check=true
//         while (check) {
//             check = false
//             for (const key of remchars) {
//                 if (mapping[key].length === 1) {
//                     const [char] = mapping[key]
//                     // remove char everywhere else
//                     remchars = remchars.filter(c => c!== key)
//                     for (const c of remchars) {
//                         mapping[c] = mapping[c].filter(c => c!== char)
//                     }
//                     check=true
//                 }
//             }
//         }
//     }

//     let mappings = [...allPossibleMappings(mapping)]

//     // just use the first valid mapping and pray it works
//     for (const mapping of mappings) {
//         wireToDigit = wire => dmapi[sortstr([...wire].map(e=>mapping[e][0]).join(''))]
//         result = display.map(e=>wireToDigit(e)).join('')
//         if(result.length===4) {
//             count += parseInt(result || 0)
//             break
//         } else {
//             console.log(line, mapping)
//         }
//     }
// }
// count;

// function* allPossibleMappings(mapping) {
//     let rem = undefined;
//     for (const k of Object.keys(mapping)) {
//         if (mapping[k].length !== 1) {
//             rem = k
//             break
//         }
//     }

//     if (rem !== undefined) {
//         for(const r of mapping[rem]) {
//             yield* allPossibleMappings({...mapping, [rem]: [r]})
//         }
//     } else {
//         yield mapping
//     }
// }



;
((i=(a,b,...r)=>!b?a:r.length?i(new Set([...a].filter(e=>b.has(e))),...r):new Set([...a].filter(e=>b.has(e))),d=(a,...b)=>new Set([...a].filter(e=>!b.includes(e))),n=a=>new Set([...a]),s=a=>[...a].sort().join(''),u=a=>[...a][0],p=i=>(...fns)=>fns.reduce((i,f)=>f(i),i),v=r=>Object.entries(r).reduce((o,[k,v])=>({...o,[v]:k}),{}))=>lines.reduce((t,l,_,a,m=v(p(l.slice(0,10).reduce((t,c)=>({...t,[c.length]:i(n(c),t[c.length])}),{}),0)(s=>({...s,a:u(i(s[3],s[5])),f:u(i(s[2],s[4],s[6])),d:u(i(s[4],s[5]))}),s=>({...s,b:u(d(i(s[4],s[6]),s.f)),c:u(d(s[2],s.f))}),s=>({...s,e:u(d(s[7],...s[6],s.c,s.d))}),s=>({...s,g:u(d(s[7],...Object.values(s)))}),)))=>t+l.slice(10).reduce((t,d)=>10*t+{abcefg:0,cf:1,acdeg:2,acdfg:3,bcdf:4,abdfg:5,abdefg:6,acf:7,abcdefg:8,abcdfg:9}[s([...d].map(char=>m[char]))],0),0))()

