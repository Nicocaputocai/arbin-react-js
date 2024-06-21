import React, {useState, useMemo} from "react";
import {FileContext} from "../contexts/file";

export const FileProvider = ({children}) => {
  const [file, setFile] = useState("");
  const value = useMemo(() => ({file, setFile}), [file, setFile]);

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
};