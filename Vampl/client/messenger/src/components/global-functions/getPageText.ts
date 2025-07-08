import { useLayoutEffect } from "react";
import { SetDispatch } from "../types/global";
import queryRequest from "./queryRequest";
import { dataApi } from "../../store/api/dataApi";
import { Dispatch } from "@reduxjs/toolkit";

const useGetPageText = <T,>(setPageText:SetDispatch<T | null>,page:string,dispatch:Dispatch) => {
  useLayoutEffect(() => {
    const initText = async () => {
      const [lang] = navigator.language.split('-');
      const {text} = await queryRequest(dataApi,'getPageText',{url:'getText',param:[page,lang]},dispatch);

      setPageText(text);
    }

    initText();
  },[]);
}

export default useGetPageText;