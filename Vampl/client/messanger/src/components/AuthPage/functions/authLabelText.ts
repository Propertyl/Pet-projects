const getLabelText = (input:string | undefined,inputError:string) => {
    if(!input) return '...';
      if(inputError) {
        return `Wrong ${input}`;
      }

      return input;
}

export default getLabelText

