// categories
export const categories = [
  { id: 'jet', title: 'Jet', image: 'https://images.unsplash.com/photo-1624969862644-791f3dc98927?q=80&w=1600&auto=format&fit=crop' },
  { id: 'small', title: 'Small Boat', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop' },
  { id: 'big', title: 'Big Boat', image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1600&auto=format&fit=crop' },
]

function makeOptionSet(seed){
  return [
    { key:'a', text:`Option A (${seed})`},
    { key:'b', text:`Option B (${seed})`},
    { key:'c', text:`Option C (${seed})`},
    { key:'d', text:`Option D (${seed})`},
  ]
}

function genQsForCategory(category, language='en'){
  const arr = []
  let idCounter = 1
  const imgs = {
    jet: [
      'https://images.unsplash.com/photo-1624969862644-791f3dc98927?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519659528534-7fd733a832a0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593443320739-77f8e3d5fbf9?q=80&w=1200&auto=format&fit=crop',
    ],
    small: [
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
    ],
    big: [
      'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561131989-dc00b2e1dc98?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565788061455-8b0ae6b5f66a?q=80&w=1200&auto=format&fit=crop',
    ],
  }
  ;[3,2,1].forEach((w)=>{
    const needed = 18
    for(let i=0;i<needed;i++){
      const seed = `${category}-${w}-${i+1}`
      const useImg = i % 2 === 0
      const img = useImg ? imgs[category][i % imgs[category].length] + `&sig=${i}` : undefined
      arr.push({
        id: seed, category, language, weight: w, isMock: i < 12,
        text: `(${category.toUpperCase()}) Q${idCounter++} — Weight ${w}`,
        image: img,
        options: makeOptionSet(i+w).map((op,k)=>({
          ...op,
          image: (i+k)%7===0 ? `https://picsum.photos/seed/${seed}-${op.key}/400/240` : undefined,
        })),
        correct: 'abcd'[i % 4],
      })
    }
  })
  return arr
}

export const DEMO_QUESTIONS = [
  ...genQsForCategory('jet'),
  ...genQsForCategory('small'),
  ...genQsForCategory('big'),
]

export function shuffle(a){ const arr=a.slice(); for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]] } return arr }
function takeFromPool(pool,n){ const sh = shuffle(pool); return { taken: sh.slice(0, Math.min(n, sh.length)), rest: sh.slice(Math.min(n, sh.length)) } }

export function composeFlexible(src, desired){
  const warnings=[]
  let pool3 = src.filter(q=>q.weight===3)
  let pool2 = src.filter(q=>q.weight===2)
  let pool1 = src.filter(q=>q.weight===1)

  let { taken:t3, rest:r3 } = takeFromPool(pool3, desired.w3); pool3 = r3
  if (t3.length < desired.w3){
    const deficit = desired.w3 - t3.length
    const borrow = takeFromPool(pool2, deficit)
    t3 = [...t3, ...borrow.taken]
    pool2 = borrow.rest
    if (borrow.taken.length < deficit){
      const deficit2 = deficit - borrow.taken.length
      const borrow1 = takeFromPool(pool1, deficit2)
      t3 = [...t3, ...borrow1.taken]
      pool1 = borrow1.rest
      if (borrow1.taken.length < deficit2) warnings.push('Not enough questions to fully satisfy 3-pt quota.')
    }
    warnings.push('Filled missing 3-pt with lower weights.')
  }

  let { taken:t2, rest:r2 } = takeFromPool(pool2, desired.w2); pool2 = r2
  if (t2.length < desired.w2){
    const deficit = desired.w2 - t2.length
    const borrow = takeFromPool(pool1, deficit)
    t2 = [...t2, ...borrow.taken]
    pool1 = borrow.rest
    if (borrow.taken.length < deficit) warnings.push('Not enough questions to fully satisfy 2-pt quota.')
    warnings.push('Filled missing 2-pt with 1-pt.')
  }

  const { taken:t1 } = takeFromPool(pool1, desired.w1)
  if (t1.length < desired.w1) warnings.push('Not enough questions to fully satisfy 1-pt quota.')

  const set = shuffle([...t3, ...t2, ...t1])
  return { set, warnings }
}

export function sumPoints(questions){ return questions.reduce((s,q)=>s+q.weight,0) }
