import { IAppColor, IComponentProps, TAppColors, TFirstColor, TSecondColor, TThirdColor } from "../../../globalTypes&Interfaces"
import { View, ViewStyle } from 'react-native';
import { PTxt } from "../../../global_components/text";

interface ISymbol {
    width: number | "auto"
    height: number | "auto"
    backgroundColor: TAppColors | "transparent"
    txtFontSize: number
    opacity?: number
    pTxtStyle?: ViewStyle
}

const LogicSymbol = ({
    children,
    backgroundColor = '#6B7280',
    width = 55,
    height = 55,
    txtFontSize = 24,
    pTxtStyle = {}
}: Omit<IComponentProps, 'backgroundColor'> & ISymbol) => {
    return (
        <View
            style={{
                borderRadius: 10,
                backgroundColor: backgroundColor,
                width: width,
                height: height,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <PTxt
                fontSize={txtFontSize}
                style={{ ...pTxtStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                {children}
            </PTxt>
        </View>
    )
};

export default LogicSymbol