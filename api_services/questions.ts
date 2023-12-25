import { TQuestionTypes } from "../Screens/GameScrn/typesAndInterfaces";
import { IReturnObjOfAsyncFn, PATHS, SERVER_ORIGIN } from "./globalApiVars"
import axios from "axios";
import { IError } from "./types&Interfaces";
import { Storage } from "../utils/storage";
import { IS_TESTING, TESTING_USER_ID } from "../globalVars";

interface IQuestion {
    sentence: string
    answer: string[]
    choices: { letter: string, value: string }[]
};
type TPath = { name: string, value: string | string[] | number | boolean };

// how to throw an error if the element does not exist
const getQuestionsApiPath = PATHS[0];

function appendParamsToUrl(url: URL, paths: TPath[]) {
    paths.forEach(({ name, value }) => url.searchParams.append(name, JSON.stringify(value)))
}

const memory = new Storage();

export type TReturnValGetQuestions<TData> = Promise<IReturnObjOfAsyncFn<TData>>

export async function getQuestions<TData>(
    questionsToGetNum: number,
    questionTypes: TQuestionTypes[],
    userId: string,
    questionsAnsweredArr?: string[],
    hasAnsweredAQuestion?: boolean,
): TReturnValGetQuestions<TData> {
    try {
        console.log("what is up...")
        const getQuestionsApiUrl = new URL(`${SERVER_ORIGIN}/${getQuestionsApiPath}`);
        // const userId: string | null = await (IS_TESTING ? new Promise(() => TESTING_USER_ID) : memory.getItem("userId"))
        let params: TPath[] = [
            { name: "questionsToGetNum", value: questionsToGetNum },
            { name: "questionTypes", value: questionTypes },
            { name: "userId", value: userId }
        ];

        if (questionsAnsweredArr?.length) {
            params.push({ name: "questionsAnsweredArr", value: questionsAnsweredArr })
        };

        if (hasAnsweredAQuestion) {
            params.push({ name: "hasAnsweredAQuestion", value: hasAnsweredAQuestion })
        };

        appendParamsToUrl(getQuestionsApiUrl, params);

        console.log("getQuestionsApiUrl: ", getQuestionsApiUrl)

        const response = await axios.get<TData>(getQuestionsApiUrl.toString());

        return { data: response.data }
    } catch (error) {
        console.error("An error has occurred: ", error)
        const { response } = error as IError<{ msg: string }>;
        console.error(`STATUS ${response?.status}. An error has occurred in getting the questions from the server: `, response.data);

        return { didErrorOccur: true, data: null }
    }
}