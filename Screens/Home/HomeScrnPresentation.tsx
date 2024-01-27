import Layout from "../../global_components/Layout";
import { Alert, View } from 'react-native'
import { PTxt } from "../../global_components/text";
import { useNavigation } from '@react-navigation/native';
import { TScreenNames, TStackNavigation } from "../../Navigation";
import { useColorStore, useGameScrnTabStore, useQuestionsStore } from "../../zustand";
import Button from "../../global_components/Button";
import { Storage } from "../../utils/storage";
import { getUserId, sortRandomly } from "../../utils/generalFns";
import { getHasUserReachedQuizGenerationLimit } from "../../api_services/users/getHasUserReachedQuizGenerationLimit";
import { CustomError, ICustomError } from "../../utils/errors";
import { useRef, useState } from "react";

const HomeScrnPresentation = () => {
    const navigation = useNavigation<TStackNavigation>();
    const updateGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
    const updateQuestionStore = useQuestionsStore(state => state.updateState);
    const questionsForNextQuiz = useQuestionsStore(state => state.questionsForNextQuiz);
    const setQuestionsStore = useQuestionsStore(state => state.updateState);
    const appColors = useColorStore();
    const memory = new Storage();
    const currentAppColors = appColors.themesObj[appColors.currentTheme];
    const [isPlayLogicGameBtnDisabled, setIsPlayLogicGameBtnDisabled] = useState(false);

    async function handleOnBtnPress(
        scrnName: TScreenNames,
        types: Exclude<Parameters<typeof updateGameScrnTabStore>[0], number | boolean>,
        gameType?: "logic" | "math"
    ) {
        try {
            const userId = await getUserId() as string;
            const result = await getHasUserReachedQuizGenerationLimit(userId);
            console.log("result: ", result)

            if (result.hasReachedLimit) {
                Alert.alert("You have reached your limit of quizzes that can be generated within a 24 hour period. Please try again later.")
                throw new CustomError("The user has reached their daily limit of quizzes generated.", 429);
            }

            if ((scrnName === "GameScreen") && questionsForNextQuiz.length && (gameType === "logic")) {
                await memory.setItem("isGameOn", true);
                updateGameScrnTabStore(types, "questionTypes");
                updateGameScrnTabStore("quiz", "mode");
                updateQuestionStore(0, "questionIndex");
                setQuestionsStore(sortRandomly(questionsForNextQuiz), "questions");
                navigation.navigate(scrnName);
                return;
            }

            if ((scrnName === "GameScreen") && (gameType === "logic")) {
                await memory.setItem("isGameOn", true);
                const userId = await getUserId() as string;
                const result = await getHasUserReachedQuizGenerationLimit(userId);

                console.log("result, yo there meng: ", result)

                if (result.hasReachedLimit) {
                    throw new CustomError("The user has reached daily limit of quiz generation.", 429);
                };

                if (!result.wasSuccessful) {
                    Alert.alert("Something went wrong in generating your quiz. Please try again later.")
                    throw new CustomError("Something went wrong on the server. Unable to check if the user can take a quiz.", 400);
                }

                updateGameScrnTabStore(types, "questionTypes");
                updateGameScrnTabStore("quiz", "mode");
                updateQuestionStore(0, "questionIndex");
                navigation.navigate(scrnName);
                return;
            }
        } catch (error) {
            const { status, msg } = error as ICustomError;

            if (status === 429) {
                Alert.alert("You have reached your limit of quizzes that can be generated within a 24 hour period. Please try again later.");
            }

            memory.setItem("isGameOn", false);
            console.error("An error has occurred. Error message: ", msg);
        }
    }

    return (
        <Layout>
            <View style={{ display: "flex", flexDirection: 'column', flex: 1 }}>
                <View style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        isDisabled={false}
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={async _ => {

                            await handleOnBtnPress("GameScreen", ["propositional", "predicate"], "logic")
                        }}
                    >

                        <PTxt>PROPOSITIONAL</PTxt>
                    </Button>
                </View>
                <View
                    style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        isDisabled={false}
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={async _ => {

                            await handleOnBtnPress("GameScreen", ["predicate"])
                        }}
                    >
                        <PTxt>PREDICATE</PTxt>
                    </Button>
                </View>
                <View
                    style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        isDisabled={false}
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second} handleOnPress={async _ => {

                            await handleOnBtnPress("GameScreen", ["diagrams"])
                        }}
                    >
                        <PTxt>DIAGRAMS</PTxt>
                    </Button>
                </View>
                <View
                    style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        isDisabled={false}
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second} handleOnPress={async _ => {
                            await handleOnBtnPress("GameScreen", ["diagrams", "predicate", "propositional"])
                        }}
                    >
                        <PTxt>ALL</PTxt>
                    </Button>
                </View>
            </View>
        </Layout>
    );
};

export default HomeScrnPresentation;