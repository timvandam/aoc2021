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
    chars: /(\w)/g,
    things: /(.)/g,
    rlines: document.body.innerText.trim().split('\n'),
    lines: ()=>f.rlines.map(e=>e.trim()).filter(e=>e),
    read: (r=f.numberlist,lines=f.lines())=>lines.map(l=>[...l.matchAll(r)].map(e=>e.slice(1).map(e=>isNaN(e)?e:Number(e))).flat(Infinity)),
    // reads matrix based on given size (height)
    readmatsCS: (size,lines=f.lines()) => f.read(f.numberlist,lines).reduce((mats, row, i, a) => i%size==0?[...mats,Array.from({length:size},(_,j)=>a[i + j])]:mats, []),
    // reads matrix based on empty lines
    readmatsEL: (lines=f.rlines) => lines.reduce((r, line) => line.trim().length ? [r, r[1].push([...line.matchAll(f.numberlist)].map(e=>e.slice(1).map(e=>isNaN(e)?e:Number(e))).flat(Infinity))][0] : [r, r[0].push(r[1]), r[1] = []][0], [[], []])[0]
  }
  Set.prototype.union = function (...sets) {
    return new Set([...this, ...sets.flatMap(set => [...set])])
  }
  Set.prototype.intersect = function (...sets) {
    return new Set([...this].filter(e => sets.every(set => set.has(e))))
  }
  Set.prototype.difference = function (b) {
    return new Set([...this].filter(e => !b.has(e)))
  }
  Set.prototype.xor = function (b) {
    return this.union(this.difference(b), b.difference(this))
  }
  set = (...elements) => new Set(elements)




  // 114403 too low
  b=`9C0141080250320F1802104A08`.trim()
  b=document.body.innerText
  all=b.trim()
  // first 3 bits: packet version
  // next 3: type ID
  // type 4: literal
  //  length must be a multiple of 4 bits. each group has prefix 1 butthe last group
  hextobin = {
    0: '0000',
    1: '0001',
    2: '0010',
    3: '0011',
    4: '0100',
    5: '0101',
    6: '0110',
    7: '0111',
    8: '1000',
    9: '1001',
    A: '1010',
    B: '1011',
    C: '1100',
    D: '1101',
    E: '1110',
    F: '1111',
  }
  all = [...all].map(char => hextobin[char]).join('')

  types = {
    4:'lit'
    // other wise its an operator that does a calc on subpackets
    // length type ID: 0 => 15 bits is the total length of subpackets
    //                 1 => 11 bits is total length of subpackets
    //       has a label
  }

  let s = 0
  function parse(str) {
    let cursor = 0
    const version = parseInt(str.slice(cursor, cursor+=3), 2)
    const typeID = parseInt(str.slice(cursor, cursor += 3), 2)
    console.log('v',version,'t',typeID)
    let parsed ={version,typeID,content:''}
// 10100000000001101010000000000000101111010001111000
// v 100  4
// t 010  2
//       lid 1 = 15
//      00010010
//      v 000
//      t 000
//      lid 0
    if (typeID === 4) {
      // while (str[cursor] === '0') cursor++
      let cont = true
      let res = ''
      while (cont) {
        const [c, ...r] = str.slice(cursor, cursor += 5)
        cont = c == '1'
        res += r.join('')
      }
      parsed.content = parseInt(res, 2)
    } else {
      let result = ''
      let handlesub = (content) => {}
      if (typeID=='0') {
        // sum
        result = 0
        handlesub = content => {
          console.log('add',result,content)
          result += content
        }
      } else if (typeID =='1'){
        //product
        result = 1
        handlesub = content => { 
          console.log('mult',result,content)
          result *= content 
        }
      } else if (typeID=='2') {
        // min
        result = Number.MAX_SAFE_INTEGER
        handlesub = content => {
          result = Math.min(result, content)
          console.log('min',result,content)
        }
      }else if (typeID=='3') {
        // max
        result = 0
        handlesub = content => {
          result = Math.max(result, content)
          console.log('max',result,content)
        }
      }else if (typeID=='5') {
        // sub1 > sub2 == 1, else 0
        // exactly two subpackets
        result = -1
        handlesub = content => {
          if (result === -1) result = content;
          else {
            if (result > content) result = 1
            else result = 0
            console.log('gt',result,content)
          }
        }
      } else if (typeID == '6') {
        // less than. sub1 < sub2 -> 1, else 0
        result = -1
        handlesub = content => {
          if (result == -1) result = content;
          else {
            if (result < content) result = 1
            else result = 0
            console.log('lt',result,content)
          }
          
        }
      } else if (typeID == '7') {
        // equal to. 1 or 0
        result = -1
        handlesub = content => {
          console.log('type 7!!!!!!!!!!!!!!!!!!')
          if (result == -1) result = content;
          else {
            if (result == content) result = 1
            else result = 0
            console.log('eq',result,content)
          }
        }
      } else {
        console.log('unknown typeID',typeID)
        throw 'unknown typeid'
      }
      // Op
      const lengthID = str.slice(cursor, cursor+=1)
      let len = -1
      if (lengthID == '0') {
        // 15 bits
        const bits = str.slice(cursor, cursor += 15)
        len = parseInt(bits, 2)

        let sub = str.slice(cursor, cursor += len)
        while (sub.length) {
          const res = parse(sub)
          if(typeID=='7') {
            console.log('EQ ON THIS!')
            console.log(handlesub.toString())
          }
          console.log('sub res 1',res.parsed)
          handlesub(res.parsed.content)
          sub = res.remaining
        }
        
      } else if (lengthID == '1') {
        // 11 bits. AMOUNT OF SUBPACKETS!!!
        const bits = str.slice(cursor, cursor += 11)
        len = parseInt(bits, 2)


        let sub = str.slice(cursor)
        for (let i = 0; i < len; i++) {
          const res = parse(sub)
          console.log('sub res 2',res.parsed)
          handlesub(res.parsed.content)
          sub = res.remaining
        }
        str = sub
        cursor = 0
        
      } else {
        console.log('wrong length id', lengthID,cursor,'/',str.length)
        throw 'wrong'
      }

      if (typeID=='7') {
        console.log('eq with lengthid', lengthID, 'len', len)
      }

      parsed.content = result

    }


    let remaining =str.slice(cursor)
    s += parsed.version
    return {parsed,remaining}
  }
  console.log('r',parse(all).parsed.content)

  // sum of versions

  //v 3 100
  //t 7 111 00000000010100000100001000000000100101000000110010000011110001100000000010000100000100101000001000