const defaultGetQuery = ({url,param}:{url:string,param?:string}) => {
  if(param) {
    return `${url}/${param}`;
  }

  return `${url}`;
}

export default defaultGetQuery;