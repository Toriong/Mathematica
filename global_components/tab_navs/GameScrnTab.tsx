import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { View, SafeAreaView, GestureResponderEvent, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useColorStore } from "../../zustand";
import Button from "../Button";
import { PTxt } from "../text";

const FONT_SIZE_NON_SCORE_TXT = 21;
const FONT_SIZE_SCORE_TXT = 28;

const GameScrnTab = (props: MaterialTopTabBarProps) => {
    // notes: 
    // get the currentTheme
    // after getting the current themem, get the themesObj and query hte object using the string from currentTheme
    const currentTheme = useColorStore(state => state.currentTheme);
    const colorThemesObj = useColorStore(state => state.themesObj);
    const currentThemeObj = colorThemesObj[currentTheme];

    function handleBtnPress(event: GestureResponderEvent) {

    }

    return (
        <SafeAreaView style={{ width: "100%", display: 'flex', backgroundColor: currentThemeObj.first }}>
            {/* this View container will contain the following: */}

            {/* START OF row 1 (flex, row) */}
            {/* view */}
            {/* back arrow */}
            {/* view */}

            {/* START of view (flex, flex-column)*/}
            {/* right (number) | wrong (number) */}
            {/* timer */}
            {/* END of view */}
            {/* END OF row 1 */}

            {/* START of row 2 */}
            {/* Score: (tracker for the score, number) */}
            {/* END of row 2 */}
            <View style={{ display: 'flex', flexDirection: 'row', width: "100%", paddingTop: "3%" }}>
                <View style={{ width: "30%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button handleOnPress={handleBtnPress}>
                        <View style={{ borderWidth: 3, borderColor: currentThemeObj.second, borderRadius: 50, padding: 8 }}>
                            <FontAwesomeIcon icon={faArrowLeft} size={50} color={currentThemeObj.second} />
                        </View>
                    </Button>
                </View>
                <View style={{ width: "70%", display: 'flex', alignItems: 'center', paddingTop: 7 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: "100%" }}>
                        <PTxt txtColor="green" fontSize={FONT_SIZE_NON_SCORE_TXT} style={{ textAlign: 'left', minWidth: 120 }}>
                            Right: 0
                        </PTxt>
                        <PTxt txtColor="red" fontSize={FONT_SIZE_NON_SCORE_TXT} style={{ textAlign: 'left', minWidth: 120 }}>
                            Wrong: 0
                        </PTxt>
                    </View>
                    <View style={{ width: '100%', marginTop: 15, paddingRight: "16%", display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <PTxt style={{ width: "auto" }} fontSize={FONT_SIZE_NON_SCORE_TXT} >
                            TIME: 1:59
                        </PTxt>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: "3%" }}>
                <View style={{ width: "37%", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <PTxt fontSize={FONT_SIZE_SCORE_TXT} fontStyle="italic">Score: </PTxt>
                    <PTxt fontSize={FONT_SIZE_SCORE_TXT}>11</PTxt>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default GameScrnTab;