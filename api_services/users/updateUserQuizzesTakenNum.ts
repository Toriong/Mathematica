import axios, { AxiosResponse } from "axios";
import { PATHS, SERVER_ORIGIN } from "../globalApiVars";
import { TCancelTokenSource } from "../../zustandStoreTypes&Interfaces";
import { CustomError } from "../../utils/errors";
import { getUserId } from "../../utils/generalFns";

type TReqBody = {
    userId: string
    dateMs: number
}

export async function updateUserQuizzesTakenNum() {
    try {
        const userId = (await getUserId()) as string;
        const serverUrl = `${SERVER_ORIGIN}/${PATHS[3]}`;
        const response = await axios.put<any, AxiosResponse<{ msg: string }, any>, TReqBody>(
            serverUrl,
            { userId: userId, dateMs: Date.now() },
            { timeout: 5_000 }
        );

        if (response.status !== 200) {
            throw new CustomError(`Failed to update the total quizzes generated for the user within a 24 hour time span. Error message: ${response.data}`, response.status)
        };

        return { wasSuccessful: true, msg: response.data.msg }
    } catch (error) {
        console.error("An error has occurred in updating the number of the quizzes taken by the user. Error: ", error);

        return { wasSuccessful: false }
    }
}
