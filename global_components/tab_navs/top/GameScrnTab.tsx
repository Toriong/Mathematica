import { View, SafeAreaView, GestureResponderEvent, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useApiQsFetchingStatusStore, useColorStore, useGameScrnTabStore, useQuestionsStore } from "../../../zustand";
import Button from "../../Button";
import { PTxt } from "../../text";
import { useEffect, useState } from "react";
import { OVERLAY_OPACITY, structuredClone } from "../../../globalVars";
import { TStackNavigationProp } from "../../../Navigation";
import { saveQuiz } from "../../../api_services/quiz/saveQuiz";
import { CustomError } from "../../../utils/errors";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer"
import { getUserId } from "../../../utils/generalFns";
import { Alert } from "react-native";
import SafeAreaViewWrapper from "../../SafeAreaViewWrapper";
import uuid from 'react-native-uuid';
import axios from 'axios';
import { IQuestionOnClient } from '../../../zustandStoreTypes&Interfaces';
import { Storage } from '../../../utils/storage';
import { updateUserQuizzesTakenNum } from '../../../api_services/users/updateUserQuizzesTakenNum';
import TabWrapper from '../../TabWrapper';

const FONT_SIZE_NON_SCORE_TXT = 21;
const FONT_SIZE_SCORE_TXT = 28;

function getTimeForUI(millis: number) {
    const minutes = Math.floor(millis / 60_000);
    const seconds = ((millis % 60_000) / 1000).toFixed(0);

    return minutes + ":" + ((parseInt(seconds) < 10) ? "0" : "") + seconds;
};

const GameScrnTab = ({ navigate }: TStackNavigationProp) => {
    const currentTheme = useColorStore(state => state.currentTheme);
    const colorThemesObj = useColorStore(state => state.themesObj);
    const rightNum = useGameScrnTabStore(state => state.right);
    const wrongNum = useGameScrnTabStore(state => state.wrong);
    const mode = useGameScrnTabStore(state => state.mode);
    const timer = useGameScrnTabStore(state => state.timer);
    const gettingQsResponseStatus = useApiQsFetchingStatusStore(state => state.gettingQsResponseStatus);
    const questions = useQuestionsStore(state => state.questions);
    const isTimerOn = useGameScrnTabStore(state => state.isTimerOn);
    const setGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
    const setQuestionsStore = useQuestionsStore(state => state.updateState);
    const getAddtionalQCancelToken = useGameScrnTabStore(state => state.getAddtionalQCancelTokenSource);
    const setApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
    const currentThemeObj = colorThemesObj[currentTheme];
    const questionIndex = useQuestionsStore(state => state.questionIndex)
    const questionsForNextQuiz = useQuestionsStore(state => state.questionsForNextQuiz);

    function handleBackToMainScrnBtnPress() {
        getAddtionalQCancelToken.cancel();
        setGameScrnTabStore(false, "willResetGetAdditionalQCancelTokenSource");
        let unansweredQs = structuredClone<IQuestionOnClient[]>((questionIndex === 0) ? questions.slice(1) : questions.filter(question => !question.userAnswer));
        const questionsForNextQuizUpdated = questionsForNextQuiz?.length ? [...unansweredQs, ...questionsForNextQuiz] : unansweredQs;

        if (questionsForNextQuizUpdated.length <= 10) {
            setQuestionsStore(questionsForNextQuizUpdated, "questionsForNextQuiz");
        } else if ((questionsForNextQuiz.length <= 5) && (questionsForNextQuizUpdated.length > 0)) {
            setApiQsFetchingStatusStore(true, "willGetQs");
            setApiQsFetchingStatusStore(true, "areQsReceivedForNextQuiz")
        } else if (questionsForNextQuiz.length === 0) {
            setApiQsFetchingStatusStore(true, "willGetQs");
            setApiQsFetchingStatusStore(true, "areQsReceivedForNextQuiz")
            setApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus")
        }

        setGameScrnTabStore("finished", "mode");
        setGameScrnTabStore(0, "right")
        setGameScrnTabStore(0, "wrong")
        setQuestionsStore([], "questions");
        navigate("Home");
        setGameScrnTabStore(axios.CancelToken.source(), "getAddtionalQCancelTokenSource")
        setGameScrnTabStore(true, "willResetGetAdditionalQCancelTokenSource")
    };

    async function saveQuizAfterQuizIsDone() {
        const quizObj: Parameters<typeof saveQuiz>[0] = {
            _id: uuid.v4().toString(),
            finishedQuizAtMs: Date.now(),
            userId: (await getUserId()) as string,
            questions: questions
        };

        saveQuiz(quizObj)
            .then(response => {
                console.log("Response for saving quiz into the database.")
                if (!response.wasOperationSuccessful) {
                    throw new CustomError(response.msg ?? "Failed to save quiz. No message was provided from the server.", response.status ?? 500)
                }

                console.log("Quiz was saved into the database.")
            })
            .catch((error) => {
                console.error('Failed to save quiz into the database: ', error)
            })
    }

    function handleOnComplete() {
        updateUserQuizzesTakenNum()
            .then(response => {
                console.log("From the server: ", response);
            })
            .catch((error) => {
                console.error("An error has occurred in incrementing the total times that the user has taken a quiz within a 24 hour time period.");
                console.error("Error object: ", error);
            })
        const answeredQs = questions.filter(question => question.userAnswer);
        let unansweredQs = questions
            .filter(question => !question.userAnswer)
            .filter(question => !question.wasSkipped);


        setGameScrnTabStore("finished", 'mode');

        if (unansweredQs[1]) {
            setQuestionsStore(unansweredQs.slice(1), "questionsForNextQuiz")
        } else {
            setTimeout(() => {
                setApiQsFetchingStatusStore(true, "areQsReceivedForNextQuiz");

                setApiQsFetchingStatusStore(true, "willGetQs");

                setApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus");
            }, 400);
        }

        // the user didn't answer any questions
        if (!answeredQs.length) {
            setQuestionsStore([], "questions");
            Alert.alert("Looks like you didn't answer a question. This quiz will not be saved.")
        } else {
            saveQuizAfterQuizIsDone();
            setQuestionsStore(answeredQs, "questions");
        }

        navigate('ResultsScreen');
    };

    useEffect(() => {
        if (gettingQsResponseStatus === "SUCCESS") {
            setTimeout(() => {
                setGameScrnTabStore(true, "isTimerOn");
            }, 400)
        } else if ((gettingQsResponseStatus === "IN_PROGRESS") || (gettingQsResponseStatus === "FAILURE")) {
            setGameScrnTabStore(false, "isTimerOn");
        }
    }, [gettingQsResponseStatus]);

    return (
        <TabWrapper
            style={{
                flexDirection: 'row',
                width: '100%',
                position: 'relative',
                display: 'flex',
                height: 150
            }}
        >
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
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
                <View style={{ marginTop: "3%", paddingBottom: 10, position: 'relative' }}>
                    <View style={{ width: mode === "review" ? "100%" : "37%", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <PTxt fontSize={FONT_SIZE_SCORE_TXT} fontStyle="italic">Score: </PTxt>
                        <PTxt fontSize={FONT_SIZE_SCORE_TXT}>{rightNum}</PTxt>
                    </View>
                </View>
            </View>
        </TabWrapper>
    );
};

export default GameScrnTab;