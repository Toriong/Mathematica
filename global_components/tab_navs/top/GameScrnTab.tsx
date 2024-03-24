import { View, SafeAreaView, GestureResponderEvent, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useApiQsFetchingStatusStore, useColorStore, useGameScrnTabStore, useMathGameStore, useQuestionsStore } from "../../../zustand";
import Button from "../../Button";
import { PTxt } from "../../text";
import { useEffect, useState } from "react";
import { OVERLAY_OPACITY, structuredClone } from "../../../globalVars";
import { TStackNavigationProp } from "../../../Navigation";
import { saveQuiz } from "../../../api_services/quiz/saveQuiz";
import { CustomError } from "../../../utils/errors";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer"
import TabWrapper from '../../TabWrapper';
import { useGetAppColors } from '../../../custom_hooks/useGetAppColors';
import TabOverlay from '../../overlays/TabOverlay';

const FONT_SIZE_NON_SCORE_TXT = 21;
const FONT_SIZE_SCORE_TXT = 28;

function getTimeForUI(millis: number) {
    const minutes = Math.floor(millis / 60_000);
    const seconds = ((millis % 60_000) / 1000).toFixed(0);

    return minutes + ":" + ((parseInt(seconds) < 10) ? "0" : "") + seconds;
};

const GameScrnTab = ({ navigate }: TStackNavigationProp) => {
    const rightNum = useMathGameStore(state => state.right);
    const wrongNum = useMathGameStore(state => state.wrong);
    const mode = useMathGameStore(state => state.mode);
    const timer = useMathGameStore(state => state.timer);
    const wasSubmitBtnPressed = useMathGameStore(state => state.wasSubmitBtnPressed);
    const gettingQsResponseStatus = useApiQsFetchingStatusStore(state => state.gettingQsResponseStatus);
    const questions = useQuestionsStore(state => state.questions);
    const setMathGameStore = useMathGameStore(state => state.updateState);
    const isTimerOn = useMathGameStore(state => state.isTimerOn);
    const { currentThemeObj } = useGetAppColors();

    function handleBackToMainScrnBtnPress() {
        navigate('Home')
    };

    function handleOnComplete() {
        navigate('ResultsScreen');
    };

    return (
        <TabWrapper
            style={{
                flexDirection: 'row',
                width: '100%',
                position: 'relative',
                display: 'flex',
                height: 200,
            }}
            Overlay={wasSubmitBtnPressed ? <TabOverlay /> : null}
        >
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    borderBottomWidth: .8,
                    borderBottomColor: currentThemeObj.second,
                    paddingBottom: 13,
                    position: 'relative'
                }}
            >
                <View style={{ display: 'flex', flexDirection: 'row', width: "100%", paddingTop: "3%" }}>
                    <View style={{ width: "30%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button backgroundColor='none' handleOnPress={handleBackToMainScrnBtnPress}>
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
                        {(mode === "quiz") && (
                            <View style={{ width: '100%', marginTop: 15, paddingRight: "16%", display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row' }}>
                                <CountdownCircleTimer
                                    isPlaying={isTimerOn}
                                    duration={timer}
                                    colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                    colorsTime={[7, 5, 2, 0]}
                                    size={71}
                                    onComplete={handleOnComplete}
                                >
                                    {({ remainingTime, color }) => (
                                        <PTxt style={{ color, fontSize: 17 }}>{getTimeForUI(remainingTime * 1000)}</PTxt>
                                    )}
                                </CountdownCircleTimer>
                            </View>
                        )
                        }
                    </View>
                </View>
                <View
                    style={{
                        paddingBottom: 10,
                        paddingLeft: 13,
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    <View
                        style={{
                            width: (mode === "review") ? "100%" : "37%",
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                    >
                        <PTxt fontSize={FONT_SIZE_SCORE_TXT} fontStyle="italic">Score: </PTxt>
                        <PTxt fontSize={FONT_SIZE_SCORE_TXT}>{rightNum}</PTxt>
                    </View>
                </View>
            </View>
        </TabWrapper>
    );
};

export default GameScrnTab;