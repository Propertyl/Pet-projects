
const parsePassword = (password:string) => {
 console.log('entered password:',password);
   if(password.length > 6 && /[A-Z]/g.test(password) && /[0-9]/g.test(password)) {
      return true;
   }

   return false;
}

export default parsePassword;