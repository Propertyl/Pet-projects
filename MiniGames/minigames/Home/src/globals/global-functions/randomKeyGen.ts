import { randomNumber } from "@packages/shared/src/functions/globalFunctions";

function randomKey() {
  let key = '';

  for(let i = 0; i < randomNumber(4,10); i++) {
    key += String.fromCharCode(randomNumber(65,91));
  }

  return key;
}

export default randomKey;