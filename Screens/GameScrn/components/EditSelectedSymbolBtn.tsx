import Button, { ButtonProps } from "../../../global_components/Button";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

type TFontAwesomeIcon = ReturnType<typeof FontAwesomeIcon>;
type TMoveSymbolBtnProps = Omit<ButtonProps & { Icon: TFontAwesomeIcon }, "children">;

const EditSelectedSymbolBtn = ({
        handleOnPress,
        dynamicStyles = {},
        Icon
}: TMoveSymbolBtnProps) => {
    return (
        <Button
            handleOnPress={handleOnPress}
            dynamicStyles={dynamicStyles}
            backgroundColor="transparent"
        >
            {Icon}
        </Button>
    );
}

export default EditSelectedSymbolBtn;