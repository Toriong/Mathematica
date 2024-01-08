import Layout from "../../global_components/Layout";
import { View, StyleSheet } from 'react-native';
import { HeadingTxt, PTxt } from "../../global_components/text";
import { useApiQsFetchingStatusStore, useGameScrnTabStore, useQuestionsStore } from "../../zustand";
import Button from "../../global_components/Button";
import { useGetAppColors } from "../../custom_hooks/useGetAppColors";
import { BORDER_RADIUS_NUM, PRIMARY_COLOR, SUCCESS_COLOR, WARNING_COLOR } from "../../globalVars";
import { useEffect } from "react";
import { IQuestion } from "../../sharedInterfaces&TypesWithBackend";
import { IQuestionOnClient, IQuestionsForObj } from "../../zustandStoreTypes&Interfaces";
import { useNavigation } from "@react-navigation/native";
import { TStackNavigation } from "../../Navigation";
import { getQuestions } from "../../api_services/quiz/getQuestions";
import { getInitialQs } from "../../api_services/quiz/getInitialQs";
import { Storage } from "../../utils/storage";

const BTN_FONT_SIZE = 22;
const PTXT_FONT_SIZE = 35;

const ResultsPresentation = () => {
    // How to provide type checking for the navigation function for the screen names? 
    const { navigate } = useNavigation<TStackNavigation>();
    const rightNum = useGameScrnTabStore(state => state.right);
    const wrongNum = useGameScrnTabStore(state => state.wrong);
    const questionTypes = useGameScrnTabStore(state => state.questionTypes);
    const updateGameScrnStore = useGameScrnTabStore(state => state.updateState);
    const updateQuestionsStore = useQuestionsStore(state => state.updateState);
    const willGetQs = useApiQsFetchingStatusStore(state => state.willGetQs);
    const apiQsFetchingStatus = useApiQsFetchingStatusStore(state => state.gettingQsResponseStatus);
    const updateApiFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
    const appColors = useGetAppColors();
    const memory = new Storage();

    async function handlePlayAgainBtnPress() {
       

        updateGameScrnStore("quiz", "mode");
        navigate("GameScreen");
    };

    function handleHomeBtnPress() {
        navigate("Home")
    };

    function handleReviewBtnPress() {
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