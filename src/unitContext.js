import React, { createContext, useContext, useState } from "react";

const UnitContext = createContext();

export const UnitProvider = ({ props }) => {
  const [unit, setUnit] = useState("C"); 

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  return (
    <UnitContext.Provider value={{ unit, toggleUnit }}>
      { props }
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  return useContext(UnitContext);
};
