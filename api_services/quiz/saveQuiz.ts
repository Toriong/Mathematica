import axios from "axios";
import { IS_TESTING, TESTING_USER_ID } from "../../globalVars";
import { IQuiz, IResponse } from "../../sharedInterfaces&TypesWithBackend";
import { CustomError, ICustomError } from "../../utils/errors";
import { TDataTypes } from "../../utils/generalFns";
import { Storage } from "../../utils/storage";
import { SERVER_ORIGIN, getPath } from "../globalApiVars";
import { ISentRequestResult } from "../types&Interfaces";

interface IMandatoryFields<TFieldName> {
    fieldName: TFieldName
    correctType: TDataTypes
    depth: number
}
type IInvalidResult = { fieldName: string, correctType: TDataTypes, receivedType: TDataTypes, receivedValue: any }
type IIsDataTypesValidResults = (IInvalidResult | (Pick<IInvalidResult, "fieldName"> & { msg: "The field name does not exist." }))[]

const appMemory = new Storage();

function validateDataTypeOfObj() {

}
// have it execute for the first level of the object
function validateReqDataObj<TMandatoryFieldNames, TObj>(
    mandatoryFields: IMandatoryFields<TMandatoryFieldNames>[],
    reqDataObj: TObj
): IIsDataTypesValidResults {
    let dataTypeValidityResults: IIsDataTypesValidResults = [];

    for (const fieldName in reqDataObj) {
        const mandatoryField = mandatoryFields.find(mandatoryField => mandatoryField.fieldName === fieldName);

        if (!mandatoryField) {
            dataTypeValidityResults.push({ fieldName: fieldName, msg: "The field name does not exist." });
            continue;
        };

        const currentValOfIteration = reqDataObj[fieldName];

        // NOTES: 
        // if the currentValOfIteration is an array, then check the values of their fields.


        if (typeof currentValOfIteration !== mandatoryField.correctType) {
            dataTypeValidityResults.push({
                fieldName: fieldName,
                correctType: mandatoryField.correctType,
                receivedType: typeof currentValOfIteration,
                receivedValue: currentValOfIteration
            })
        }
    }

    return dataTypeValidityResults;
}


const QUIZ_MANDATORY_FIELDS: IMandatoryFields<keyof IQuiz>[] = [
    { fieldName: "questions", correctType: "object", depth: 0 },
    { fieldName: "finishedQuizAtMs", correctType: "number", depth: 0 },
    { fieldName: "userId", correctType: "string", depth: 0 }
];

export async function saveQuiz(quiz: IQuiz & { _id: string }): Promise<ISentRequestResult> {
    try {
        const userId = IS_TESTING ? TESTING_USER_ID : await appMemory.getItem("userId");

        if (typeof userId !== "string") {
            throw new CustomError("Clientside error: `userId` must be a string.", 404);
        }

        if(typeof quiz._id !== "string"){
            throw new CustomError("Clientside error: `_id` must be a string or it was not provided.", 404);
        }

        if (typeof quiz.finishedQuizAtMs !== "number") {
            throw new CustomError("Clientside error: `finishedQuizAtMs` must be a number.", 404);
        }

        if (!Array.isArray(quiz.questions)) {
            throw new CustomError("Clientside error: `questions` must be an array.", 404);
        }

        const reqBody: Required<IQuiz & { _id: string }> = {
            _id: quiz._id,
            userId: userId,
            finishedQuizAtMs: quiz.finishedQuizAtMs,
            questions: quiz.questions
        }
        console.log("will send the request to the server...")
        const url = new URL(`${SERVER_ORIGIN}/${getPath("save-quiz-result")}`)
        const response = await axios.post<IResponse<null>>(url.toString(), reqBody)

        console.log("response yo there: ", response)

        if(response.status !== 200){
            throw new CustomError("An error has occurred in saving quiz into the db.", response.status);
        }

        return { wasOperationSuccessful: true, msg: response.data.msg ?? "This response does not contain a message from the server." }
    } catch (error) {
        const errorObj = error as any
        const { status, msg } = error as any;
        console.error("STATUS CODE: ", status ?? errorObj.response.status)
        console.error("An error has occurred in saving the quiz into the database. Error message: ", msg ?? errorObj.response?.data?.msg);
        return { wasOperationSuccessful: false }
    }
}