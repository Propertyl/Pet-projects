import { DefaultRef, SetDispatch } from "../../types/global";

const setupAvatar = (tempFile:DefaultRef,setTempImage:SetDispatch<Blob>) => (event:React.ChangeEvent<HTMLInputElement>) => {
  const fileInput = event.target.files as HTMLInputElement['files'];
  if(fileInput) {
    const file:Blob = fileInput[0];
    const [type,fileType] = file.type.split('/');
    if(type === 'image' && /^(png|jpeg|jpg|webp)/.test(fileType)) {
      tempFile.current = file;
      const reader = new FileReader;
      reader.readAsDataURL(file);
      reader.onload = () => {
        setTempImage(reader.result as string);
      }
    } else {
      alert('This is not image!');
    }
    event.target.value = "";
  }
}

  export default setupAvatar;