
const nameValidation = (name:string) => {
    if(name.length > 5 && name.length < 24) {
        return true;
    }

    return false;
}

export default nameValidation;