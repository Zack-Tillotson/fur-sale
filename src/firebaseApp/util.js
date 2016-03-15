import Random from 'random-js';

// This function should return a psuedo random number generated
// with the seed and cycled discard times.
function getRng(seed, discard = 0) {

  const rng = Random.engines.mt19937();
  
  rng.seed(seed);
  
  if(discard > 0) {
    rng.discard(discard);
   }
  
  return rng;
  
}

function shuffle(rng, ary) {
  Random.shuffle(rng, ary);
}

export default { getRng, shuffle }