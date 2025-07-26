import { Dispatch, RefObject, SetStateAction } from "react";

type setDispatch<T> = Dispatch<SetStateAction<T>>;

type RefObj<T> = RefObject<T | null>;

export {setDispatch,RefObj};