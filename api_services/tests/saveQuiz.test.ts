import { TESTING_USER_ID } from "../../globalVars";
import { IQuestion, IQuiz } from "../../sharedInterfaces&TypesWithBackend";
import testingQs from "../../testingQs.json"
import { CustomError } from "../../utils/errors";
import { IChoice } from "../../zustandStoreTypes&Interfaces";
import { saveQuiz } from "../quiz/saveQuiz";
import uuid from "react-native-uuid"
import { expect } from "chai";


// GOAL: 
// send the request to the "/save-quiz-result" route and check if any errors when saving the quiz into the database


describe("Testing the saving of user quiz into the db.", () => {

    it("Sending request to the server to save the quiz into the db.", async () => {
        try {
            const questionsAnswered = (testingQs as Partial<IQuestion>[]).slice(11).map((question): IQuestion => {
                return {
                    _id: uuid.v4(),
                    type: "propositional",
                    sentence: question.sentence as string,
                    choices: question.choices as IChoice[],
                    userAnswer: question.answer as string[],
                    answer: question.answer as string[],
                }
            });

            const response = await saveQuiz({ _id: uuid.v4().toString(), finishedQuizAtMs: Date.now(), questions: questionsAnswered, userId: TESTING_USER_ID });

            if (!response.wasOperationSuccessful) {
                expect(1).to.equal(2, "Test failed. An error has occurred in saving quiz into the db.")
                throw new CustomError(`Failed to save the quiz into the db. Message from server: ${response.msg}`, 500);
            }
        } catch (error) {
            console.error("An error has occurred in saving the quiz into the database. Error: ", error);
            expect(1).to.equal(2)
        }
    });
})