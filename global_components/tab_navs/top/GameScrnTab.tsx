import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { View, SafeAreaView, GestureResponderEvent, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useApiQsFetchingStatusStore, useColorStore, useGameScrnTabStore, useQuestionsStore } from "../../../zustand";
import Button from "../../Button";
import { PTxt } from "../../text";
import { useEffect, useState } from "react";
import SafeAreaViewWrapper from "../../SafeAreaViewWrapper";
import { OVERLAY_OPACITY } from "../../../globalVars";
import { TStackNavigationProp } from "../../../Navigation";
import { IQuestionOnClient } from "../../../zustandStoreTypes&Interfaces";

const FONT_SIZE_NON_SCORE_TXT = 21;
const FONT_SIZE_SCORE_TXT = 28;

function getTimeForUI(millis: number) {
    const minutes = Math.floor(millis / 60_000);
    const seconds = ((millis % 60_000) / 1000).toFixed(0);

    return minutes + ":" + ((parseInt(seconds) < 10) ? "0" : "") + seconds;
};


const GameScrnTab = ({ navigate }: TStackNavigationProp) => {
    const wasSubmitBtnPressed = useGameScrnTabStore(state => state.wasSubmitBtnPressed);
    const currentTheme = useColorStore(state => state.currentTheme);
    const colorThemesObj = useColorStore(state => state.themesObj);
    const rightNum = useGameScrnTabStore(state => state.right);
    const wrongNum = useGameScrnTabStore(state => state.wrong);
    const timer = useGameScrnTabStore(state => state.timer);
    const gameScrnMode = useGameScrnTabStore(state => state.mode);
    const isLoadingModalOn = useGameScrnTabStore(state => state.isLoadingModalOn);
    const gettingQsResponseStatus = useApiQsFetchingStatusStore(state => state.gettingQsResponseStatus);
    const questions = useQuestionsStore(state => state.questions);
    const updateQuestionsStore = useQuestionsStore(state => state.updateState);
    const setGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
    const [timerObj, setTimerObj] = useState({ timerStr: getTimeForUI(timer), timerMs: timer });
    const [intervalTimer, setIntervalTimer] = useState<ReturnType<typeof setInterval> | null>(null);
    const currentThemeObj = colorThemesObj[currentTheme];

    function handleBtnPress() {
        // reset the questions when the user goes to the Home screen
        navigate("Home");

        if (intervalTimer) {
            clearInterval(intervalTimer);
            setIntervalTimer(null);
        }
    };

    // if the user is on the game screen and the modal is on the ui, then don't start the timer 
    // if getting the questions is progress, then start the timer 

    useEffect(() => {
        if ((gettingQsResponseStatus !== "IN_PROGRESS") && !isLoadingModalOn) {
            const intervalTimer = setInterval(() => {
                setTimerObj(timerObj => {
                    if (timerObj.timerMs <= 0) {
                        return timerObj;
                    }

                    const timerMs = timerObj.timerMs - 1_000;
                    const timerStr = getTimeForUI(timerMs);

                    return { timerStr, timerMs }
                })
            }, 1_000);
            setIntervalTimer(intervalTimer)
        }
    }, [gettingQsResponseStatus, isLoadingModalOn]);

    useEffect(() => {
        if ((timerObj.timerMs <= 0) && (gameScrnMode === "quiz")) {
            setGameScrnTabStore("finish", 'mode');
            const answeredQuestions = questions.filter(question => question.userAnswer);
            updateQuestionsStore<IQuestionOnClient[]>(answeredQuestions, "questions")
            navigate('ResultsScreen');
        }
    }, [timerObj])

    return (
        <SafeAreaViewWrapper
            layoutStyle={{ position: 'relative' }}
            OverlayComp={
                wasSubmitBtnPressed && (
                    <View
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'black',
                            position: 'absolute',
                            zIndex: 1,
                            opacity: OVERLAY_OPACITY
                        }}
                    />
                )
            }
        >
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
                {/* present the loading ui here */}
                <View style={{ display: 'flex', flexDirection: 'row', width: "100%", paddingTop: "3%" }}>
                    <View style={{ width: "30%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button isDisabled={false} backgroundColor='none' handleOnPress={handleBtnPress}>
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
                        <View style={{ width: '100%', marginTop: 15, paddingRight: "16%", display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row' }}>
                            <PTxt style={{ width: "auto" }} fontSize={FONT_SIZE_NON_SCORE_TXT}>
                                TIME:
                            </PTxt>
                            <PTxt style={{ width: 57, display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }} fontSize={FONT_SIZE_NON_SCORE_TXT}>
                                {timerObj.timerStr}
                            </PTxt>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: "3%", paddingBottom: 10, position: 'relative' }}>
                    <View style={{ width: "37%", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <PTxt fontSize={FONT_SIZE_SCORE_TXT} fontStyle="italic">Score: </PTxt>
                        <PTxt fontSize={FONT_SIZE_SCORE_TXT}>{rightNum}</PTxt>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaViewWrapper>
    );
};

export default GameScrnTab;