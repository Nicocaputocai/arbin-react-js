import {useContext} from "react";
import {FileContext} from "../contexts/file";

export const useFile = () => useContext(FileContext);