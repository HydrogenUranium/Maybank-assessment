import { useEffect, useState } from "react";

export const useDataFetching = <T,>(
    inputValue: string,
    fetchDataFunction: (input: string) => Promise<T[]>
  ): [T[], boolean] => {
    const [lastInput, setLastInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<T[]>([]);
  
    useEffect(() => {
      (async () => {
        if (inputValue && inputValue !== lastInput && !isLoading) {
          setLastInput(inputValue);
          setIsLoading(true);
          try {
            const result = await fetchDataFunction(inputValue);
            setData(result);
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
              setIsLoading(false);
          }
        }
      })();
    }, [inputValue, lastInput, isLoading, fetchDataFunction]);
  
    return [data, isLoading];
  };
