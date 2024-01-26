import axios from "axios";
import { PATHS, SERVER_ORIGIN } from "../globalApiVars";
import { TCancelTokenSource } from "../../zustandStoreTypes&Interfaces";
import { CustomError } from "../../utils/errors";

export async function updateUserQuizzesTakenNum(userId: string, cancelToken: TCancelTokenSource) {
    try {
        const serverUrl = `${SERVER_ORIGIN}/${PATHS[3]}`;
        const response = await axios.put(serverUrl, { userId: userId }, { cancelToken: cancelToken.token });

        if (response.status !== 200) {
            throw new CustomError(`Failed to update the total quizzes generated for the user within a 24 hour time span. Error message: ${response.data}`, response.status)
        };

        return { wasSuccessful: true, msg: response.data }
    } catch (error) {
        console.error("An error has occurred in updating the number of the quizzes taken by the user. Error: ", error);

        return { wasSuccessful: false }
    }
}
