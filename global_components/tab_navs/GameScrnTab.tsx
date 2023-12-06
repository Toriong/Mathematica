import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { View, SafeAreaView, GestureResponderEvent, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useColorStore, useGameScrnTabStore } from "../../zustand";
import Button from "../Button";
import { PTxt } from "../text";
import { useState } from "react";

const FONT_SIZE_NON_SCORE_TXT = 21;
const FONT_SIZE_SCORE_TXT = 28;

const GameScrnTab = (props: MaterialTopTabBarProps) => {
    const currentTheme = useColorStore(state => state.currentTheme);
    const colorThemesObj = useColorStore(state => state.themesObj);
    const rightNum = useGameScrnTabStore(state => state.right);
    const wrongNum = useGameScrnTabStore(state => state.wrong);
    const [timer, setTimer] = useState(60);
    const currentThemeObj = colorThemesObj[currentTheme];

    function handleBtnPress(event: GestureResponderEvent) {

    }

    return (
        <SafeAreaView style={{ width: "100%", display: 'flex', backgroundColor: currentThemeObj.first, borderBottomColor: currentThemeObj.second, borderWidth: 1 }}>
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
                            Right: {rightNum}
                        </PTxt>
                        <PTxt txtColor="red" fontSize={FONT_SIZE_NON_SCORE_TXT} style={{ textAlign: 'left', minWidth: 120 }}>
                            Wrong: {wrongNum}
                        </PTxt>
                    </View>
                    <View style={{ width: '100%', marginTop: 15, paddingRight: "16%", display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <PTxt style={{ width: "auto" }} fontSize={FONT_SIZE_NON_SCORE_TXT} >
                            TIME: {timer}
                        </PTxt>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: "3%", paddingBottom: 10 }}>
                <View style={{ width: "37%", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <PTxt fontSize={FONT_SIZE_SCORE_TXT} fontStyle="italic">Score: </PTxt>
                    <PTxt fontSize={FONT_SIZE_SCORE_TXT}>{rightNum}</PTxt>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default GameScrnTab;