import { Alert, View } from "react-native";
import Layout from "../../global_components/Layout";
import { HeadingTxt, PTxt } from "../../global_components/text";
import Button from "../../global_components/Button";
import { Icon } from "../../global_components/Icon";
import { faArrowLeft, faArrowRight, faBox, faCheckSquare, faSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { useMathGameStore } from "../../zustand";
import { convertToSecsToMins } from "../../utils/generalFns";
import { useMemo } from "react";
import { useGetAppColors } from "../../custom_hooks/useGetAppColors";
import { IMathGameInfoStates } from "../../zustandStoreTypes&Interfaces";
import PulseWrapper from "../../global_components/PulseWrapper";
import { btnStyles } from '../../global_styles/globalStyles';
import { TStackNavigationProp } from "../../Navigation";
import { useNavigation } from "@react-navigation/native";

type TMaxQuizTime = typeof MAX_QUIZ_TIME
type TMaxUntimedQuestions = typeof MAX_TOTAL_QUESTIONS
type TMinQuizTimeSecs = 60;
type TMininumUntimedQuestions = 20

const MAX_QUIZ_TIME = 300
const TXT_FONT_SIZE = 22
const PADDING_START = 30
const HEADER_FONT_SIZE = 29
const MAIN_HEADER_FONT_SIZE = 32
const UNSELECTED_GAME_TYPE_OPACITY = .3
const MAX_TOTAL_QUESTIONS = 200

const MathOptionsScrnPresentation = () => {
    const mathQuizTime = useMathGameStore(state => state.timer);
    const isQuizTimed = useMathGameStore(state => state.isQuizTimed);
    const totalQs = useMathGameStore(state => state.totalQs);
    const { currentThemeObj } = useGetAppColors();
    const { navigate } = useNavigation<TStackNavigationProp>();
    const setMathGameStore = useMathGameStore(state => state.updateState);

    function handleCheckBoxBtnPress(isQuizTimed: boolean) {
        return () => {
            setMathGameStore(isQuizTimed, 'isQuizTimed');
        }
    }

    function handlePlayBtnPress() {
        navigate('MathQuizScrn')
        setMathGameStore('quiz', 'mode')
    }

    function handleArrowBtnPress(
        arrowDirection: 'left' | 'right',
        fieldToUpdate: keyof Pick<IMathGameInfoStates, "totalQs" | "timer">,
        gameSettingValToUpdate: number,
        numToAdd: 10 | 60,
        minComparisonNum: TMininumUntimedQuestions | TMinQuizTimeSecs,
        maxComparisonNum: TMaxQuizTime | TMaxUntimedQuestions
    ) {
        return () => {
            if ((Math.abs(gameSettingValToUpdate) <= minComparisonNum) && (arrowDirection === 'left')) {
                Alert.alert('hey there')
                return;
            }

            if ((Math.abs(gameSettingValToUpdate) >= maxComparisonNum) && (arrowDirection === 'right')) {
                Alert.alert('yo there meng')
                return;
            }
            const valueToAdd = (arrowDirection === 'left') ? (-1 * numToAdd) : numToAdd

            setMathGameStore(gameSettingValToUpdate + valueToAdd, fieldToUpdate)
        }
    }

    const mins = useMemo(() => convertToSecsToMins(mathQuizTime), [mathQuizTime]);
    const opacityForUntimedQuizSec = isQuizTimed ? UNSELECTED_GAME_TYPE_OPACITY : 1
    const opacityForTimedQuizSec = isQuizTimed ? 1 : UNSELECTED_GAME_TYPE_OPACITY

    return (
        <Layout>
            <View
                style={{
                    width: "100%",
                    flex: 1,
                    marginTop: 20
                }}
            >
                <View
                    style={{
                        width: '100%',
                        flex: .5
                    }}
                >
                    <View
                        style={{
                            paddingStart: 10
                        }}
                    >
                        <HeadingTxt fontSize={HEADER_FONT_SIZE} style={{ fontStyle: 'italic' }}>
                            Timed or Untimed?
                        </HeadingTxt>
                    </View>
                    <View
                        style={{
                            paddingLeft: PADDING_START,
                            display: 'flex',
                            flexDirection: 'column',
                            width: 250
                        }}
                    >
                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                            <Button
                                handleOnPress={handleCheckBoxBtnPress(true)}
                            >
                                <Icon icon={isQuizTimed ? faCheckSquare : faSquare} color={currentThemeObj.second} />
                            </Button>
                            <PTxt
                                style={{
                                    marginStart: 5,
                                    opacity: opacityForTimedQuizSec
                                }}
                                fontSize={TXT_FONT_SIZE}
                            >
                                Timed Quiz:
                            </PTxt>
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <View
                                style={{
                                    borderBottomWidth: 1,
                                    borderColor: currentThemeObj.second,
                                    marginVertical: 10,
                                    width: "80%"
                                }}
                            >
                                <PTxt
                                    style={{
                                        textAlign: 'center',
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        opacity: opacityForTimedQuizSec
                                    }}
                                    fontSize={TXT_FONT_SIZE}
                                >
                                    {mins} {mins === 1 ? 'min' : 'mins'}
                                </PTxt>
                            </View>
                            <View
                                style={{
                                    gap: 7,
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >

                                <Button
                                    isDisabled={(mathQuizTime <= 60) || !isQuizTimed}
                                    handleOnPress={handleArrowBtnPress('left', "timer", mathQuizTime, 60, 60, MAX_QUIZ_TIME)}
                                    backgroundColor={currentThemeObj.second}
                                    dynamicStyles={{
                                        paddingHorizontal: 5,
                                        paddingVertical: 15,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        opacity: ((mathQuizTime <= 60) || !isQuizTimed) ? .3 : 1,
                                        width: 100,
                                        borderRadius: 15,
                                    }}
                                >
                                    <Icon icon={faArrowLeft} />
                                </Button>
                                <Button
                                    isDisabled={(mathQuizTime >= MAX_QUIZ_TIME) || !isQuizTimed}
                                    handleOnPress={handleArrowBtnPress('right', "timer", mathQuizTime, 60, 60, MAX_QUIZ_TIME)}
                                    backgroundColor={currentThemeObj.second}
                                    dynamicStyles={{
                                        paddingHorizontal: 5,
                                        paddingVertical: 15,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        opacity: ((mathQuizTime >= MAX_QUIZ_TIME) || !isQuizTimed) ? .3 : 1,
                                        width: 100,
                                        borderRadius: 15,
                                    }}
                                >
                                    <Icon icon={faArrowRight} />
                                </Button>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            paddingLeft: PADDING_START,
                            display: 'flex',
                            flexDirection: 'column',
                            width: 250,
                            marginTop: 15
                        }}
                    >
                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                            <Button
                                handleOnPress={handleCheckBoxBtnPress(false)}
                            >
                                <Icon icon={isQuizTimed ? faSquare : faCheckSquare} color={currentThemeObj.second} />
                            </Button>
                            <PTxt
                                style={{
                                    marginStart: 5,
                                    opacity: opacityForUntimedQuizSec
                                }}
                                fontSize={TXT_FONT_SIZE}
                            >
                                Untimed Quiz:
                            </PTxt>
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <View
                                style={{
                                    borderBottomWidth: 1,
                                    borderColor: currentThemeObj.second,
                                    marginVertical: 10,
                                    width: "80%"
                                }}
                            >
                                <PTxt
                                    style={{
                                        textAlign: 'center',
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        opacity: opacityForUntimedQuizSec
                                    }}
                                    fontSize={TXT_FONT_SIZE}
                                >
                                    {totalQs} qs
                                </PTxt>
                            </View>
                            <View
                                style={{
                                    gap: 7,
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >

                                <Button
                                    isDisabled={(totalQs <= 20) || isQuizTimed}
                                    handleOnPress={handleArrowBtnPress('left', "totalQs", totalQs, 10, 20, MAX_TOTAL_QUESTIONS)}
                                    backgroundColor={currentThemeObj.second}
                                    dynamicStyles={{
                                        paddingHorizontal: 5,
                                        paddingVertical: 15,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        opacity: ((totalQs <= 20) || isQuizTimed) ? .3 : 1,
                                        width: 100,
                                        borderRadius: 15,
                                    }}
                                >
                                    <Icon icon={faArrowLeft} />
                                </Button>
                                <Button
                                    isDisabled={(totalQs >= MAX_TOTAL_QUESTIONS) || isQuizTimed}
                                    handleOnPress={handleArrowBtnPress('right', "totalQs", totalQs, 10, 20, MAX_TOTAL_QUESTIONS)}
                                    backgroundColor={currentThemeObj.second}
                                    dynamicStyles={{
                                        paddingHorizontal: 5,
                                        paddingVertical: 15,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        opacity: ((totalQs >= MAX_TOTAL_QUESTIONS) || isQuizTimed) ? .3 : 1,
                                        width: 100,
                                        borderRadius: 15,
                                    }}
                                >
                                    <Icon icon={faArrowRight} />
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        width: '100%',
                        flex: .5,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <PulseWrapper
                        duration={1000}
                    >
                        <Button
                            handleOnPress={handlePlayBtnPress}
                            backgroundColor="#007BFF"
                            dynamicStyles={{
                                ...btnStyles.shadow,
                                padding: 30,
                                borderRadius: 30,
                                width: 150
                            }}
                        >
                            <PTxt
                                style={{
                                    textAlign: 'center',
                                    width: '100%'
                                }}
                                fontSize={22}
                            >
                                PLAY!
                            </PTxt>
                        </Button>
                    </PulseWrapper>
                </View>
            </View>
        </Layout>
    );
};

export default MathOptionsScrnPresentation;