import axios from "axios";
import { TCancelTokenSource } from "../../zustandStoreTypes&Interfaces";
import { SERVER_ORIGIN, getPath } from "../globalApiVars";
import { CustomError } from "../../utils/errors";

const hasUserReachedQuizGeneratinLimitApiPath = getPath("get-did-user-reach-quiz-generation-limit");

export async function getHasUserReachedQuizGenerationLimit(userId: string) {
    try {
        const url = new URLSearchParams(`${SERVER_ORIGIN}/${hasUserReachedQuizGeneratinLimitApiPath}`);

        url.set("userId", userId)
        
        const response = await axios.get(url.toString(), {  timeout: 5_000 })

        if(response.status !== 200){
            throw new CustomError("Failed to check if the user has reached their daily limit of quizzes generated.", response.status);
        };

        return { hasReachedLimit: response.data as boolean }
    } catch (error) {
        console.error("An error has occurred in getting the quiz generatin limit number for the user. Error object: ", error);

        return { wasSuccessful: false }
    }
}