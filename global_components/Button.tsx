import { GestureResponderEvent, TouchableOpacity } from "react-native"
import { IComponentProps } from "../globalTypes&Interfaces"

type OnPressAction = (event: GestureResponderEvent) => void
type ButtonProps = { handleOnPress: OnPressAction } & IComponentProps;

const Button = ({ children, handleOnPress }: ButtonProps) => {
    return (
        <TouchableOpacity onPress={handleOnPress}>
            {children}
        </TouchableOpacity>
    );
};

export default Button