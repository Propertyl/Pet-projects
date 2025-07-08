import textChanger from "../../Navigation/functions/textChanger";

const getLabelText = (input:string | undefined,inputError:string) => {
    if(!input) return '...';
      if(inputError) {
        return `${textChanger('Неправильний','Wrong')} ${input}`;
      }

      return input;
}

export default getLabelText;


