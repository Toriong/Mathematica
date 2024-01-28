import { useEffect } from "react";
import { useApiQsFetchingStatusStore, useGameScrnTabStore, useQuestionsStore } from "../zustand";
import { Storage } from "../utils/storage";
import { IS_TESTING, TESTING_USER_ID } from "../globalVars";
import { getInitialQs } from "../api_services/quiz/getInitialQs";
import { IQuestionOnClient, TNumberToGetForEachQuestionType } from "../zustandStoreTypes&Interfaces";
import { getUserId, sortRandomly } from "../utils/generalFns";
import { getHasUserReachedQuizGenerationLimit } from "../api_services/users/getHasUserReachedQuizGenerationLimit";
import { CustomError } from "../utils/errors";


export function useGetInitialQs(): null {
    const memory = new Storage();
    const willGetQs = useApiQsFetchingStatusStore(state => state.willGetQs);
    const areQsReceivedForNextQuiz = useApiQsFetchingStatusStore(state => state.areQsReceivedForNextQuiz);
    const questionsForNextQuiz = useQuestionsStore(state => state.questionsForNextQuiz);
    const currentQuestions = useQuestionsStore(state => state.questions);
    const numberToGetForEachQuestionType = useQuestionsStore(state => state.numberToGetForEachQuestionType);
    const updateApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
    const updateQuestionsStore = useQuestionsStore(state => state.updateState);
    const updateGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
    const getInitialQsCancelTokenSource = useGameScrnTabStore(state => state.getInitialQsCancelTokenSource);

    useEffect(() => {
        (async () => {
            try {
                const userId = await getUserId() as string;
                const result = await getHasUserReachedQuizGenerationLimit(userId);

                if (result.hasReachedLimit) {
                    console.log("The user has reached daily limit of quizzes generated.")
                    throw new CustomError("The user has reached their daily limit of quizzes generated.", 429);
                }

                if (willGetQs) {
                    updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus");
                    let userId = await memory.getItem("userId");
                    userId = IS_TESTING ? TESTING_USER_ID : userId;
                    const _numberToGetForEachQuestionType = (Object.values(numberToGetForEachQuestionType).length ? numberToGetForEachQuestionType : { predicate: 3, propositional: 3, diagrams: 3 }) as Required<TNumberToGetForEachQuestionType>
                    const response = await getInitialQs<IQuestionOnClient>(
                        userId as string,
                        getInitialQsCancelTokenSource,
                        1,
                        _numberToGetForEachQuestionType,
                        areQsReceivedForNextQuiz
                    );

                    if (response.gettingQsResponseStatus === "FAILURE") {
                        throw new Error("Failed to get the initial questions from the server.")
                    };

                    const questionsRandomlySorted = (response.questions?.length > 1) ? sortRandomly(response.questions) : response.questions;

                    if (areQsReceivedForNextQuiz) {
                        const questionsForNextQUpdated = questionsForNextQuiz?.length ? sortRandomly([...questionsForNextQuiz, ...questionsRandomlySorted]) : questionsRandomlySorted
                        updateQuestionsStore(questionsForNextQUpdated as IQuestionOnClient[], "questionsForNextQuiz")
                    } else {
                        updateQuestionsStore(questionsRandomlySorted as IQuestionOnClient[], "questions");
                        updateQuestionsStore([], "questionsForNextQuiz")
                    };

                    updateApiQsFetchingStatusStore("SUCCESS", "gettingQsResponseStatus");
                }
            } catch (error) {
                console.error("Failed to get questions from the server. Error message: ", error)
                updateApiQsFetchingStatusStore("FAILURE", "gettingQsResponseStatus");
                updateApiQsFetchingStatusStore("gettingInitialQs", "pointOfFailure");
            } finally {
                updateApiQsFetchingStatusStore(false, "willGetQs");
                updateApiQsFetchingStatusStore(false, "areQsReceivedForNextQuiz");
                updateGameScrnTabStore(false, "willNotShowLoadingModal")
            }
        })();
    }, [willGetQs]);

    return null;
}