import { ReactNode } from 'react';
import { StyleSheet, Text } from "react-native";


const FONT_FAMILY_MAIN = "San Francisco"

type TProps = {
    children: ReactNode,
    fontSize: number,
    txtColor?: string,
    style: { [key: string]: string | number },
    testID?: string,
}

export const PTxt = ({
    children,
    fontSize = 18,
    style,
    testID = "",
    txtColor = 'white',
}: TProps) => {
    return (
        <Text testID={testID} style={{ ...style, fontFamily: FONT_FAMILY_MAIN, fontSize: fontSize, color: txtColor }}>
            {children}
        </Text>
    )
}

export const HeadingTxt = ({
    children,
    style,
    fontSize = 22,
    txtColor = 'white',
    testID = ""
}: TProps) => {
    return (
        <Text testID={testID} style={{ ...style, fontFamily: FONT_FAMILY_MAIN, fontSize: fontSize, color: txtColor }}>
            {children}
        </Text>
    )
}