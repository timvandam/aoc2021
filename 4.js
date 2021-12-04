// both parts
[one,two]=(([s,..._r]=document.body.innerText.trim().split('\n').filter(e=>e).map(l=>l.trim().split(/,| +/)),r=Array.from({length:_r.length/5},()=>Array.from({length:5},()=>_r.shift())),n=new Set,a=new Set,B=b=>b.some(r=>r.every(e=>n.has(e)))||b.some((_,i)=>b.every((_,j)=>n.has(b[j][i]))),R=b=>b.flat().reduce((x,y)=>x+y*!n.has(y),0),bingo=s.reduce((b, C)=> n.has(C)?b:n.add(C)&&[...b,...r.reduce((l,c,i)=>a.has(i)?l:B(c)?a.add(i)&&[...l,[c, C*R(c)]]:l, [])], []))=>[bingo[0][1],bingo[bingo.length-1][1]])()


// meh
b=document.body.innerText
l=b.trim().split('\n');

input=l.shift().split(',').map(e=>parseInt(e))

l.shift();
boards=[]
while (l.length) {
  board = Array(5).fill(Array(5).fill(-1))
  for (let i = 0; i < 5; i++) {
    board[i] = l.shift().trim().split(/ +/).map(e=>parseInt(e))
  }
  boards.push(board)
  l.shift();
}

numSet = new Set()

function checkBingo(board) {
  // horizontal
  for (let i = 0; i < 5; i++) {
    let horbingo = true
    let verbingo = true
    for (let j = 0; j < 5; j++) {
      if (!numSet.has(board[i][j])) horbingo = false
      if (!numSet.has(board[j][i])) verbingo = false
    }
    if (horbingo || verbingo) return true
  }
}

function countNonBingo(board) {
  const non =board.flat().filter(e=>!numSet.has(e))
  return non.length?non.reduce((x,y)=>x+y, 0):0
}

bingo=false
firstscore = 0
score = 0 // sum of all unmark numbers on the winning board * number that was called
bingos=new Set()
for (let i = 0; i < input.length; i++) {
  cur = input[i]
  numSet.add(cur);
  for (let b = 0; b < boards.length; b++) {
    board=boards[b]
    if (bingos.has(b)) continue
    if (checkBingo(board)) {
      bingos.add(b)
      score = cur * countNonBingo(board)
      if (!firstscore)firstscore=score
      console.log('bingo!', score)
      console.log(board)
    }
  }
}
console.log(firstscore,score)
