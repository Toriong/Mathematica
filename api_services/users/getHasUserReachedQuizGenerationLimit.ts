import axios from "axios";
import { SERVER_ORIGIN, getPath } from "../globalApiVars";
import { CustomError } from "../../utils/errors";

const hasUserReachedQuizGeneratinLimitApiPath = getPath("get-did-user-reach-quiz-generation-limit");

export async function getHasUserReachedQuizGenerationLimit(userId: string) {
    try {
        const url = `${SERVER_ORIGIN}/${hasUserReachedQuizGeneratinLimitApiPath}`;
        const response = await axios.get(
            url, 
            { 
                params: { userId: userId, dateMs: Date.now() }, 
                timeout: 1_000 
            })

        console.log("response, hey there: ", response)

        if(response.status !== 200){
            throw new CustomError("Failed to check if the user has reached their daily limit of quizzes generated.", response.status);
        };

        return { wasSuccessful: true, hasReachedLimit: response.data as boolean }
    } catch (error) {
        console.error("An error has occurred in getting the quiz generation limit number for the user. Error object: ", error);

        return { wasSuccessful: false }
    }
}