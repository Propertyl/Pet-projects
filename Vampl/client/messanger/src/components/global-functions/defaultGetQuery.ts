import { queryArgs } from "../types/global";

const defaultGetQuery = ({url,param}:queryArgs) => {
  if(param) {
    return `${url}/${param}`;
  }

  return `${url}`;
}

export default defaultGetQuery;