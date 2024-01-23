import { CancelToken } from "axios";
import { IS_TESTING, TESTING_USER_ID } from "../../globalVars";
import { IQuestion } from "../../sharedInterfaces&TypesWithBackend";
import { CustomError, ICustomError } from "../../utils/errors";
import { getIsTValid } from "../../utils/generalFns";
import { IReturnObjOfAsyncFn, TResponseStatus } from "../globalApiVars";
import { TPromiseReturnValGetQuestions, getQuestions } from "./getQuestions";
import { TCancelTokenSource } from "../../zustandStoreTypes&Interfaces";

interface IInitialQsGetReqResult<TData> {
    gettingQsResponseStatus: TResponseStatus
    questions: TData[]
}

let apiRequestTriesNum = 0;

export async function getInitialQs<TData>(
    userId: string,
    cancelTokenSource: TCancelTokenSource,
    tries: number = 1,
    numberToGetOfEachQType = { propositional: 3, predicate: 3 },
    willClearCacheOnServer?: boolean,
) {
    try {
        const { propositional, predicate } = numberToGetOfEachQType;
        userId = IS_TESTING ? TESTING_USER_ID : userId;
        const responseGetPropostionalQs = getQuestions<{ questions: IQuestion[] }>(propositional, ["propositional"], userId as string, cancelTokenSource, null, willClearCacheOnServer);
        const responseGetPredicateQs = getQuestions<{ questions: IQuestion[] }>(predicate, ["predicate"], userId as string, cancelTokenSource, null, willClearCacheOnServer)
        const responses: Awaited<TPromiseReturnValGetQuestions<{ questions: IQuestion[] } | null>>[] = await Promise.all([responseGetPropostionalQs, responseGetPredicateQs]);
        let responsesFiltered = responses.filter(response => !!response) as IReturnObjOfAsyncFn<{ questions: IQuestion[] }>[];
        responsesFiltered = responsesFiltered?.length
            ?
            responsesFiltered.filter(response => {
                if (!response.data?.questions?.length) {
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
            [];

        console.log("responsesFiltered, hey there: ", responsesFiltered);

        if (!responsesFiltered.length && (apiRequestTriesNum >= tries)) {
            throw new CustomError("Exceeded tries of contacting api to get questions for user.", 429);
        }


        if (!responsesFiltered.length) {
            ++apiRequestTriesNum
            return await getInitialQs(userId, cancelTokenSource, tries, numberToGetOfEachQType, willClearCacheOnServer);
        }

        let questions = responsesFiltered
            .flatMap<unknown>(response => response?.data?.questions)
            .filter(question => question) as TData[];

        if (!questions.length) {
            throw new Error("Received no questions from the server.")
        }

        return { gettingQsResponseStatus: 'SUCCESS', questions: questions }
    } catch (error) {
        const { msg, status } = error as ICustomError
        apiRequestTriesNum = 0;
        const _msg = msg ? `${msg}. Status code: ${status}` : null;
        console.error(_msg ?? "Failed to get questions from the server. Error message: ", error)

        return { gettingQsResponseStatus: 'FAILURE', questions: [] }
    }
}