const phoneValidation = (phone:string) => {
    if(!/[A-ZА-Я]/ig.test(phone) && phone.length === 13 && phone.includes('+')) {
      return true;
    }

    return false;
}

export default phoneValidation;