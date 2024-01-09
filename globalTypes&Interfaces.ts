import { ReactNode, Dispatch, SetStateAction } from "react";
import { ViewStyle, TextStyle } from 'react-native'

export const DEFAULT_THIRD_COLOR = "#FFFFFF";

export type TLowerCaseLetters = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
export type TUpperCaseLetters = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
export type TLogicalSymbols = "∃";
export type TFirstColor = "#343541";
export type TSecondColor = "#6B7280";
export type TThirdColor = typeof DEFAULT_THIRD_COLOR;
export type TAppColors = TFirstColor | TSecondColor | TThirdColor
export type TStateSetter<TData> = Dispatch<SetStateAction<TData>>
export type TTakeContainerOfOfVirtualDom = () => void;
export type TLayout = {
    layoutStyle?: IComponentProps['style'] & { width?: '100%', height?: '100%' }
    OverlayComp?: IComponentProps['children']
}

export type TTxtProps = {
    children: ReactNode,
    fontSize?: number,
    txtColor?: TextStyle["color"],
    style?: TextStyle,
    fontStyle?: TextStyle['fontStyle']
}

export interface IAppColor {
    first: TFirstColor
    second: TSecondColor
    third: TThirdColor
}

export interface IThemeColors {
    light: IAppColor,
    dark: IAppColor
}

export interface IComponentProps {
    children: ReactNode
    style?: ViewStyle
    backgroundColor?: TFirstColor
    id?: string
    testID?: string
}