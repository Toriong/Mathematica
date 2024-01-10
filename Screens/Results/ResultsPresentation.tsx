import { View, StyleSheet } from 'react-native';
import { HeadingTxt, PTxt } from "../../global_components/text";
import { useApiQsFetchingStatusStore, useGameScrnTabStore, useQuestionsStore } from "../../zustand";
import { useGetAppColors } from "../../custom_hooks/useGetAppColors";
import { BORDER_RADIUS_NUM, PRIMARY_COLOR, SUCCESS_COLOR, WARNING_COLOR } from "../../globalVars";
import { useNavigation } from "@react-navigation/native";
import { TStackNavigation } from "../../Navigation";
import { useResetLogicQs } from '../../custom_hooks/useResetLogicQs';
import Layout from "../../global_components/Layout";
import Button from "../../global_components/Button";

const BTN_FONT_SIZE = 22;
const PTXT_FONT_SIZE = 35;

const ResultsPresentation = () => {
    // How to provide type checking for the navigation function for the screen names? 
    const { navigate } = useNavigation<TStackNavigation>();
    const resetLogicQs = useResetLogicQs();
    const rightNum = useGameScrnTabStore(state => state.right);
    const wrongNum = useGameScrnTabStore(state => state.wrong);
    const questionsForNextQuiz = useQuestionsStore(state => state.questionsForNextQuiz);
    const questionsFromPreviousQuiz = useQuestionsStore(state => state.questions);
    const appColors = useGetAppColors();
    const updateApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
    const updateGameScrnStore = useGameScrnTabStore(state => state.updateState);
    const updateQuestionsStore = useQuestionsStore(state => state.updateState);

    function handlePlayAgainBtnPress() {
        if (questionsForNextQuiz?.length) {
            updateQuestionsStore(questionsForNextQuiz, "questions");
            updateApiQsFetchingStatusStore("SUCCESS", "gettingQsResponseStatus");
        } else {
            updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus");
        }

        // if the questions for the next quiz has not been retrieved then change gettingQsStatus global state 
        // to IN_PROGRESS

        updateGameScrnStore("quiz", "mode");
        navigate("GameScreen");
    };

    function handleHomeBtnPress() {
        resetLogicQs();
        navigate("Home");
    };

    function handleReviewBtnPress() {
        const unansweredQsFilterOut = questionsFromPreviousQuiz.filter(question => !!question.userAnswer);
        updateQuestionsStore(unansweredQsFilterOut, "questions");
        updateQuestionsStore(0, "questionIndex");
        updateGameScrnStore("review", "mode");
        navigate("GameScreen");
    };

    return (
        <Layout>
            <View style={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center', flex: .6 }}>
                <HeadingTxt
                    fontSize={45}
                    txtColor={appColors.third}
                >
                    YOUR RESULTS:
                </HeadingTxt>
            </View>
            <View style={{ width: "100%", display: 'flex', alignItems: 'center', flex: 1, flexDirection: 'column', }}>
                <View
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <PTxt
                        fontSize={PTXT_FONT_SIZE}
                        txtColor={appColors.third}
                        style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', width: "100%" }}
                    >
                        Score:
                    </PTxt>
                    <PTxt
                        fontSize={40}
                        txtColor={appColors.third}
                        style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', width: "100%" }}
                    >
                        {rightNum}
                    </PTxt>
                </View>
                <View
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: "8%" }}
                >
                    <PTxt fontSize={PTXT_FONT_SIZE} txtColor="green">
                        Right: {rightNum}
                    </PTxt>
                    <PTxt fontSize={PTXT_FONT_SIZE} txtColor='red'>
                        Wrong: {wrongNum}
                    </PTxt>
                </View>
            </View>
            <View style={{ width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <View style={{ display: 'flex', gap: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Button
                        backgroundColor={appColors.second}
                        handleOnPress={handleReviewBtnPress}
                        dynamicStyles={styles.button}
                        isDisabled={false}
                    >
                        <PTxt fontSize={BTN_FONT_SIZE} txtColor={appColors.third}>
                            Review
                        </PTxt>
                    </Button>
                    <Button
                        backgroundColor={SUCCESS_COLOR}
                        handleOnPress={handlePlayAgainBtnPress}
                        dynamicStyles={styles.button}
                    >
                        <PTxt
                            fontSize={BTN_FONT_SIZE}
                            txtColor={appColors.third}
                            fontStyle="italic"
                            style={{ textAlign: 'center' }}
                        >
                            PLAY AGAIN!
                        </PTxt>
                    </Button>
                </View>
                <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 15 }}>
                    <Button
                        isDisabled={false}
                        backgroundColor={PRIMARY_COLOR}
                        handleOnPress={handleHomeBtnPress}
                        dynamicStyles={styles.button}
                    >
                        <PTxt
                            fontSize={BTN_FONT_SIZE}
                            txtColor={appColors.third}
                            style={{ textAlign: 'center' }}
                        >
                            Leaderboard
                        </PTxt>
                    </Button>
                    <Button
                        isDisabled={false}
                        backgroundColor={WARNING_COLOR}
                        handleOnPress={handleHomeBtnPress}
                        dynamicStyles={styles.button}
                    >
                        <PTxt
                            fontSize={BTN_FONT_SIZE}
                            txtColor={appColors.third}>
                            Home
                        </PTxt>
                    </Button>
                </View>
            </View>
        </Layout>
    )
};

const styles = StyleSheet.create({
    button: {
        width: 145,
        height: 65,
        borderRadius: BORDER_RADIUS_NUM,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ResultsPresentation;