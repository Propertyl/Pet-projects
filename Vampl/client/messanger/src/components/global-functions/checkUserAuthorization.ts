  // const dispatch = useDispatch();
  // const navigate = useNavigate();

import { useLayoutEffect } from "react";
import checkAuthorization from "../MainPage/functions/AutoAuthorization";
import { Dispatch } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router";

  
const useCheckUserAuthorization = (dispatch:Dispatch,navigate:NavigateFunction) => {
  useLayoutEffect(() => {
    checkAuthorization(dispatch,navigate);
  },[]);
}

export default useCheckUserAuthorization;