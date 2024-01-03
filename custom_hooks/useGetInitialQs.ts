import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useApiQsFetchingStatusStore, useQuestionsStore } from "../zustand";
import { Storage } from "../utils/storage";
import { IS_TESTING, TESTING_USER_ID } from "../globalVars";
import { getInitialQs } from "../api_services/quiz/getInitialQs";

// Why will it throw an error when the return type is not declare?
export function useGetInitialQs<TData>(willClearCacheOnServer?: boolean): [TData[], Dispatch<SetStateAction<TData[]>>] {
    const memory = new Storage();
    const willGetQs = useApiQsFetchingStatusStore(state => state.willGetQs);
    const updateApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
    const updateQuestionsStore = useQuestionsStore(state => state.updateState);
    const [questionsForNextQuz, setQuestionsForNextQuiz] = useState<TData[]>([]);

    useEffect(() => {
        if (willGetQs) {
            updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus");
            (async () => {
                try {
                    let userId = await memory.getItem("userId");
                    userId = IS_TESTING ? TESTING_USER_ID : userId;
                    const response = await getInitialQs(userId as string, willClearCacheOnServer);

                    if (response.gettingQsResponseStatus === "FAILURE") {
                        throw new Error("Failed to get the initial questions from the server.")
                    }

                    if (willClearCacheOnServer) {
                        setQuestionsForNextQuiz(response.questions as TData[])
                    } else {
                        updateQuestionsStore(response.questions, "questions");
                    }

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

    return [questionsForNextQuz, setQuestionsForNextQuiz];
}