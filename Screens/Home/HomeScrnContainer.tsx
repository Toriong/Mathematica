import HomeScrnPresentation from "./HomeScrnPresentation";
import { IReturnObjOfAsyncFn, SERVER_ORIGIN, TResponseStatus } from "../../api_services/globalApiVars";
import { useEffect } from "react";
import { useApiQsFetchingStatusStore, useQuestionsStore } from "../../zustand";
import { TPromiseReturnValGetQuestions, getQuestions } from "../../api_services/quiz/getQuestions";
import { IChoice, IQuestionOnClient } from "../../zustandStoreTypes&Interfaces";
import { Storage } from "../../utils/storage";
import { IS_TESTING, TESTING_USER_ID } from "../../globalVars";
import { getIsTValid } from "../../utils/generalFns";
import { CustomError, ICustomError } from "../../utils/errors";

interface IInitialQsGetReqResult {
    gettingQsResponseStatus: TResponseStatus
    questions: IQuestionOnClient[]
}

let apiRequestTriesNum = 0;

async function getInitialQs(userId: string): Promise<IInitialQsGetReqResult> {
    try {
        userId = IS_TESTING ? TESTING_USER_ID : userId;
        const responseGetPropostionalQs = getQuestions<{ questions: IQuestionOnClient[] }>(3, ["propositional"], userId as string);
        const responseGetPredicateQs = getQuestions<{ questions: IQuestionOnClient[] }>(3, ["predicate"], userId as string)
        const responses: Awaited<TPromiseReturnValGetQuestions<{ questions: IQuestionOnClient[] } | null>>[] = await Promise.all([responseGetPropostionalQs, responseGetPredicateQs]);
        let responsesFiltered = responses.filter(response => !!response.data || !!response) as IReturnObjOfAsyncFn<{ questions: IQuestionOnClient[] }>[];
        let result: IInitialQsGetReqResult | null = null;
        responsesFiltered = responsesFiltered?.length
            ?
            responsesFiltered.filter(response => {
                if(!response.data?.questions?.length){
                    return false;
                }

                return response.data.questions.every(question => {
                    const isAnswerPropertyValid = question.answer.every(answer => getIsTValid(answer, "string"));
                    const isChoicesPropertyValid = question.choices.every(choice => getIsTValid(choice, "object") && getIsTValid<string>(choice.value, "string") && getIsTValid<string>(choice.letter, "string")); 
                    const isSentencePropertyValid = getIsTValid(question.sentence, "string")

                    return isSentencePropertyValid && isChoicesPropertyValid && isAnswerPropertyValid;
                });
            })
            :
            []

        if(apiRequestTriesNum >= 5){
            throw new CustomError("Exceeded tries of contacting api to get questions for user.", 429);
        }

        if (!responsesFiltered.length) {
            ++apiRequestTriesNum  
            result = await getInitialQs(userId);
        }

        const questions = responsesFiltered.flatMap<unknown>(response => response.data?.questions) as IQuestionOnClient[];

        console.log("questions: ", questions)

        return { gettingQsResponseStatus: 'SUCCESS', questions: questions } 
    } catch (error) {
        const { msg, status } = error as ICustomError
        apiRequestTriesNum = 0;
        const _msg = msg ? `${msg}. Status code: ${status}` : null; 
        console.error(_msg ?? "Failed to get questions from the server. Error message: ", error)

        return { gettingQsResponseStatus: 'FAILURE', questions: [] }
    }
}

const HomeScrnContainer = () => {
    const memory = new Storage();
    const willGetQs = useApiQsFetchingStatusStore(state => state.willGetQs);
    const updateApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
    const updateQuestionsStore = useQuestionsStore(state => state.updateState);

    useEffect(() => {
        if (willGetQs) {
            updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus");
            (async () => {
                try {
                    let userId = await memory.getItem("userId");
                    userId = IS_TESTING ? TESTING_USER_ID : userId;
                    const response = await getInitialQs(userId as string);

                    if(response.gettingQsResponseStatus === "FAILURE"){
                        throw new Error("Failed to get the initial questions from the server.")
                    }

                    if(!response.questions || !response?.questions?.length ){
                        throw new Error("Failed to get the initial questions from the server. The `questions` array is either empty or undefined.")
                    }

                    updateQuestionsStore(response.questions, "questions");
                    updateApiQsFetchingStatusStore("SUCCESS", "gettingQsResponseStatus");
                } catch (error) {
                    console.error("Failed to get questions from the server. Error message: ", error)
                    updateApiQsFetchingStatusStore("FAILURE", "gettingQsResponseStatus");
                } finally {
                    updateApiQsFetchingStatusStore(false, "willGetQs");
                }
            })();
        }
    }, [willGetQs]);

    return <HomeScrnPresentation />;
};

export default HomeScrnContainer;