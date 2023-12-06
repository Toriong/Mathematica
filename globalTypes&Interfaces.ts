import { ReactNode } from "react";
import { ViewStyle, TextStyle } from 'react-native'

export const DEFAULT_THIRD_COLOR = "#FFFFFF";

type TFirstColor = "#343541"; 
type TSecondColor = "#6B7280";
type TThirdColor = typeof DEFAULT_THIRD_COLOR;

export type TTxtProps = {
    children: ReactNode,
    fontSize?: number,
    txtColor?: string,
    style?: TextStyle,
    fontStyle?: Pick<TextStyle, "fontStyle">['fontStyle']
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