b=`
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
`.trim()
b=document.body.innerText
lines = b.trim().split('\n').map(e=>JSON.parse(e))
function* _depths(nums, d = 0) {
  for (const num of nums) {
    if (Array.isArray(num)) {
      yield* _depths(num, d + 1)
    } else {
      yield d
    }
  }
}
depths = lines.map(nums => [..._depths(nums)])
nums = lines.map(nums => nums.flat(Infinity))
// console.log(nums)
// console.log(depths)

/**
 * explode: if nested inside four pairs
 * - add left to first regular number left of the pair (if any)
 * - add right to first number to the right (if any)
 * 
 * split: number larger than 10
 * - replace number with a pair
 * - left and right is the number from before // 2, rounded down and up
 */

function add(l, ld, r, rd) {
  return [[...l, ...r], [...ld.map(e => e + 1), ...rd.map(e => e + 1)]]
}

function magnitude(nums, depths) {
  const maxDepth = Math.max(...depths)
  for (let d = maxDepth; d >= 0; d--) {
    for (let i = 0; i < nums.length - 1; i++) {
      if (depths[i] === d && depths[i + 1] === d) {
        // console.log(`Magnitude at index ${i} for depth ${d}`)
        depths[i]--
        nums[i] = 3 * nums[i] + 2 * nums[i + 1] ?? 0
        depths.splice(i + 1, 1)
        nums.splice(i + 1, 1)
      }
    }
    // console.log('Magnitude', nums)
  }
  return nums[0]
}

function explode(nums, depths) {
  for (let i = 0; i < depths.length - 1; i++) {
    if (depths[i] == 4 && depths[i + 1] == 4) {
      const [l, r] = [nums[i], nums[i + 1]]
      // console.log(`Exploding ${l}, ${r}`)
      if (i > 0) nums[i - 1] += l
      if ((i + 1) < nums.length - 1) nums[i + 2] += r
      depths[i]--
      nums[i] = 0
      nums.splice(i + 1, 1)
      depths.splice(i + 1, 1)
      return true
    }
  }
  return false
}

function splitNum(nums,depths) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] >= 10){
      // console.log(`Splitting ${nums[i]}`)
      // split
      const pair = [Math.floor(nums[i]/2), Math.ceil(nums[i]/2)]
      nums.splice(i, 1, ...pair)
      depths.splice(i, 1, depths[i] + 1, depths[i] + 1)
      return true
    }
  }
  return false
}

function go() {
  let current = nums[0]
  let currentDepth = depths[0]
  // console.log(current, currentDepth)
  
  for (let i = 1; i < nums.length; i++) {
    ;[current, currentDepth] = add(current, currentDepth, nums[i], depths[i])
    
    let a = true
    while (a) {
      a = explode(current, currentDepth) || splitNum(current, currentDepth)
    }

    // console.log(current, currentDepth)
  }

  console.log(magnitude(current, currentDepth))

}

function go2() {
  let max = 0
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      if (i === j) continue
      const [current, currentDepth] = add(nums[i], depths[i], nums[j], depths[j])

      let a = true
      while (a) {
        a = explode(current, currentDepth) || splitNum(current, currentDepth)
      }
      max= Math.max(max, magnitude(current, currentDepth))
    }
  }
  console.log(max)
}

go2(nums)
// console.log(magnitude([9, 1, 1, 9], [2, 2, 2, 2]))



/*


[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]
[[[30,33],[35,21]],[[35,35],[37,45]]]
[[156,147],[175,201]]
[762,[175,201]]
*/