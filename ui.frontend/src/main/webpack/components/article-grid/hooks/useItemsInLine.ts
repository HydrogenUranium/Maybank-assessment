import { useEffect, useState } from "react";
import { WindowSize } from "src/main/webpack/types";

export const useItemsInLine = ({ width }: WindowSize) => {
    const getCount = (width) => {
        if (width >= 1200) {return 4;}
        if (width >= 992) {return 3;}
        if (width >= 567) {return 2;}
        return 1;
    };

    const [count, setCount] = useState(() => getCount(width));

    useEffect(() => {
        setCount(getCount(width));
    }, [width]);

    return count;
};
