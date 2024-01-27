import { Alert } from "react-native";
import { CustomError } from "../utils/errors";
import { getUserId } from "../utils/generalFns";
import { getHasUserReachedQuizGenerationLimit } from "../api_services/users/getHasUserReachedQuizGenerationLimit";

export const useGetCanUserGetAGeneratedQuiz = () => {
    
    async function getCanUserGetAGeneratedQuiz() {
        try {
            const userId = await getUserId() as string;
            const result = await getHasUserReachedQuizGenerationLimit(userId);

            console.log("result, yo there: ", result)
            
            if(!result.wasSuccessful){
                Alert.alert("Something went wrong. Couldn't generate a quiz. Please try again later.");
                throw new CustomError("The response from the server was unsuccessful.", 400);
            }

            if (result.hasReachedLimit) {
                Alert.alert("You have reached your limit of quizzes that can be generated within a 24 hour period. Please try again later.")
                throw new CustomError("The user has reached their daily limit of quizzes generated.", 429);
            }
            
            return true;
        } catch(error){
            console.error("Something went. Can't check if the user can get a generated quiz. Error message: ", error);

            return false
        }
    }

    return getCanUserGetAGeneratedQuiz;
}