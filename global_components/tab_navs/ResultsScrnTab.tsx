import { SafeAreaView, View } from "react-native";
import { useGetAppColors } from "../../custom_hooks/useGetAppColors";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { PTxt } from "../text";
import { APP_NAME } from "../../globalVars";

const FONT_SIZE_TITLE = 32;

const ResultsScrnTab = () => {
    const currentThemeObj = useGetAppColors();

    function handleBackBtnPress() {

    }

    function handlePlayAgainBtnPress() {

    }

    return (
        <SafeAreaView
            style={{
                width: "100%",
                position: 'relative',
                display: 'flex',
                backgroundColor: currentThemeObj.first,
                borderBottomColor: currentThemeObj.second,
                borderWidth: 1
            }}
        >
            <View style={{ display: 'flex', flexDirection: 'row', width: "100%", paddingTop: "3%" }}>
                <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button backgroundColor='none' handleOnPress={handleBackBtnPress}>
                        <View style={{ borderWidth: 3, borderColor: currentThemeObj.second, borderRadius: 50, padding: 8 }}>
                            <FontAwesomeIcon icon={faArrowLeft} size={50} color={currentThemeObj.second} />
                        </View>
                    </Button>
                </View>
                <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 7 }}>
                    <PTxt fontSize={FONT_SIZE_TITLE} fontStyle="italic" style={{ textAlign: 'center', width: "100%" }}>{APP_NAME}</PTxt>
                </View>
                <View
                    style={{ flex: 1 }}
                >
                    <Button
                        handleOnPress={handlePlayAgainBtnPress}
                        backgroundColor={currentThemeObj.first}
                        dynamicStyles={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <PTxt style={{ paddingHorizontal: 20, textAlign: 'center' }}>
                            PLAY AGAIN!
                        </PTxt>
                    </Button>
                    <Button
                        handleOnPress={handlePlayAgainBtnPress}
                        backgroundColor={currentThemeObj.first}
                        dynamicStyles={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <View style={{ borderColor: currentThemeObj.second, borderRadius: 50, padding: 8 }}>
                            <FontAwesomeIcon icon={faStar} size={35} color='gold' />
                        </View>
                    </Button>
                </View>
            </View>
            <View style={{ marginTop: "3%", paddingBottom: 10, position: 'relative', display: 'flex', justifyContent: 'center', width: "100%" }}>

            </View>
        </SafeAreaView>
    )
};

export default ResultsScrnTab;