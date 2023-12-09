import { GestureResponderEvent, TouchableOpacity, StyleProp, ViewStyle } from "react-native"
import { IComponentProps } from "../globalTypes&Interfaces"

export type OnPressAction = (event: GestureResponderEvent, [...rest]?: any[]) => void
interface IButton extends ViewStyle {
    dynamicStyles?: ViewStyle,
    backgroundColor: Pick<ViewStyle, 'backgroundColor'>['backgroundColor']
}
type ButtonCompProps = Omit<IComponentProps, "backgroundColor">
type ButtonProps = { handleOnPress: OnPressAction } & IButton & ButtonCompProps;

const Button = ({ children, handleOnPress, dynamicStyles = {}, backgroundColor = 'none' }: ButtonProps) => {
    return (
        <TouchableOpacity style={{ ...dynamicStyles, backgroundColor: backgroundColor }} onPress={handleOnPress}>
            {children}
        </TouchableOpacity>
    );
};

export default Button