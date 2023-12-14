import { useColorStore } from "../zustand";

export function useGetAppColors(){
    const currentColorTheme = useColorStore(state => state.currentTheme);
    const themesObj = useColorStore(state => state.themesObj);

    return themesObj[currentColorTheme];
};

