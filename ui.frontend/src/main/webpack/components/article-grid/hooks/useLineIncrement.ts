import { useEffect, useState } from "react";
import { WindowSize } from "src/main/webpack/types";

export const useLineIncrement = ({width}: WindowSize) => {
  const calculateIncrement = (width: number) => (width > 567 ? 2 : 3);

  const [increment, setIncrement] = useState(() => calculateIncrement(width));

  useEffect(() => {
    setIncrement(calculateIncrement(width));
  }, [width]);

  return increment;
};
