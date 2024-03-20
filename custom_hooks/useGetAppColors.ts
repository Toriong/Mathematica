import { useColorStore } from "../zustand";

export function useGetAppColors() {
    const colorThemesObj = useColorStore(state => state.themesObj);
    const currentTheme = useColorStore(state => state.currentTheme);
    const currentThemeObj = colorThemesObj[currentTheme];

    return { currentThemeObj, currentTheme };
};

