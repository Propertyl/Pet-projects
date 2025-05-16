const getLabelText = (input:'Phone' | 'Name' | 'Password',inputError:string) => {
      if(inputError) {
        return `Wrong ${input}`;
      }

      return input;
}

export default getLabelText

