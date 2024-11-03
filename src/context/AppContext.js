import React, { createContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [state, setState] = useState([{}]);
  const [alldata, setAllData] = useState([]);

  return (
    <AppContext.Provider value={{ state, setState, alldata, setAllData }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
