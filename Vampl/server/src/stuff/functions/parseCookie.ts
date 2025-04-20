
const parseCookies = (cookies:string) => {
  const splited = cookies.split('; ');
  
  return splited.reduce((acc:any,cookie:string) => {
      const [token,value] = cookie.split('=');

      acc[token] = value;

      return acc;
  },{});
}

export default parseCookies