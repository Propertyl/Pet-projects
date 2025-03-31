function cryptoIp(ip:string) {
  const letters = ['A','B','C','D','E','F','J','H','I','G','K','L','M','O','N','P','R','S','T','Q','X','Y','Z'];

  const numberStream = ip.split('.');
  const to2Bit = numberStream.map(Number).map(number => {
      const bit2 = number.toString(2).split('');

      for(let i:number = 0; i < bit2.length - 1; i++) {
         const temp = bit2[i];
         bit2[i] = bit2[i + 1];
         bit2[i + 1] = temp;
      }

      return bit2.join('');
  })
  .map(bits => parseInt(bits,2).toString())
  .map(number => number.split('')
  .map(Number)
  .map(code => letters[code % letters.length])
  .join('')
  )


  return to2Bit.join('');
}


async function getCryptedIP() {
  const currentUser = await fetch('https://api64.ipify.org?format=json')
  .then(res => res.json())
  .then(data => cryptoIp(data.ip));

  return cryptoIp(currentUser);
}

export default getCryptedIP;