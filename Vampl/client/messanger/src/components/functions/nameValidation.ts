
const nameValidation = (name:string) => {
    if(name.length > 5 && name.length < 24 && /[A-ZА-Я]/gi.test(name)) {
        return true;
    }

    return false;
}

export default nameValidation;