const phoneValidation = (phone:string) => {

    if(/[A-Za-z]/g.test(phone) || phone.length < 12 || !phone.includes('+')) {
      return false;
    }

    return true;
}

export default phoneValidation;