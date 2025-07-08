import { useGetSomeDataQuery } from "../../store/api/dataApi";
import useDebounceEffect from "../global-functions/useDebounceEffect";
import {useRef, useState } from "react";
import { DefaultRef, SetDispatch, UserInfo } from "../types/global";
import { useDispatch } from "react-redux";
import openRequestUser from "../Navigation/functions/openRequestUser";
import textChanger from "../Navigation/functions/textChanger";



const SearchList = ({users,changeRequest}:{users:UserInfo[],changeRequest:SetDispatch<string>}) => {
  const dispatch = useDispatch();

  return (
    <>
      {users.map(({name,image,phone},index) => (
        <div className="search-input-request-list-item" onClick={() => {
          openRequestUser(name,phone,dispatch);
          changeRequest('');
        }} key={`result-response-${index}`}>
          {image ? 
            <img className="search-input-request-list-item-image" src={`${image}`} alt="avatar" />
            :
            <div className="search-input-request-list-item-image unknown-image" data-unknown-name={name.split('').shift()}/> 
          }
          <div className="search-input-request-list-info-container">
            <p className="search-input-request-list-item-text">{name}</p>
            <p className="search-input-request-list-item-phone-text">{phone}</p>
          </div>
        </div>
      ))}
    </>
  )
}

const SearchResults = ({request,changeRequest}:{request:string,changeRequest:SetDispatch<string>}) => {
  const [sendRequest,setSendRequest] = useState<string>('');
  const {data:users}:{data:UserInfo[]} = useGetSomeDataQuery({url:'search-users',param:sendRequest},{
    skip:!sendRequest
  });
  const searchListRef:DefaultRef = useRef(null);

  useDebounceEffect(() => {
    if(request) {
      setSendRequest(request);
    }
  },[request],500);

  return (
    <>
      {users && 
        <div  ref={searchListRef} className="search-input-request-list scrollable-component">
          {users.length ? <SearchList changeRequest={changeRequest} users={users}/> : <p className="search-input-request-list-notFound">{textChanger('Нічого не знайдено','Not found anything')}</p>}
        </div>
      }
    </>
  )
}

export default SearchResults;