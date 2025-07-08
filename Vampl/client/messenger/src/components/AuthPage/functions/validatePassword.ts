
const validatePassword = (password:string) => {
   if(password.length > 6 && password.length < 32 && /[A-Z]/g.test(password) && /[0-9]/g.test(password)) {
      console.log('password normal');
      return true;
   }

   return false;
}

export default validatePassword;