import { GestureResponderEvent, View } from "react-native";
import Layout from "../../global_components/Layout";
import Button from "../../global_components/Button";
import { PTxt } from "../../global_components/text";
import { Icon } from "../../global_components/Icon";
import { faDivide, faMultiply, faPlus, faSubtract } from "@fortawesome/free-solid-svg-icons";
import { useColorStore } from "../../zustand";
import { useGetAppColors } from "../../custom_hooks/useGetAppColors";

const MathGameScrnPresentation = () => {
    const appColor = useGetAppColors();
    const colorThemesObj = useColorStore(state => state.themesObj);
    const currentTheme = useColorStore(state => state.currentTheme);

    function handleBtnPress(event: GestureResponderEvent) {

    }

    return (
        <Layout
            style={{
                flex: 1,
                width: "100%",
                height: "100%",
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'relative',
            }}
            layoutStyle={{
                position: 'relative',
                width: '100%',
                height: '100%'
            }}
        >
            <View>
                <Button
                    style={{ display: 'flex' }}
                    handleOnPress={handleBtnPress}
                >
                    <PTxt>
                        Addition
                    </PTxt>
                    <Icon icon={faPlus} />
                </Button>
                <Button
                    style={{ display: 'flex' }}
                    handleOnPress={handleBtnPress}
                >
                    <PTxt>
                        Addition
                    </PTxt>
                    <Icon icon={faPlus} />
                </Button>
                <Button
                    style={{ display: 'flex' }}
                    handleOnPress={handleBtnPress}
                >
                    <PTxt>
                        Division
                    </PTxt>
                    <Icon icon={faDivide} />
                </Button>
                <Button
                    style={{ display: 'flex' }}
                    handleOnPress={handleBtnPress}
                >
                    <PTxt>
                        Multiplication
                    </PTxt>
                    <Icon icon={faMultiply} />
                </Button>
                <Button
                    style={{ display: 'flex' }}
                    handleOnPress={handleBtnPress}
                >
                    <PTxt>
                        Subtraction
                    </PTxt>
                    <Icon icon={faSubtract} />
                </Button>
                <Button
                    style={{ display: 'flex' }}
                    handleOnPress={handleBtnPress}
                >
                    <PTxt>
                        View Binary Options
                    </PTxt>
                    <PTxt>
                        01010
                    </PTxt>
                </Button>
            </View>
        </Layout>
    )
};

export default MathGameScrnPresentation;