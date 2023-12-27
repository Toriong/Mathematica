import { expect } from "chai";
import { TESTING_USER_ID } from "../../globalVars";
import { getQuestions } from "../questions"
import { IChoice, IQuestion } from "../../zustandStoreTypes&Interfaces";
import { getIsTValid } from "../../utils/generalFns";


describe("Getting questions from the backend.", () => {
    it("Getting only predicate logic questions.", async () => {
        try {
            const response = await getQuestions<unknown>(3, ["predicate"], TESTING_USER_ID);

            if (response.didErrorOccur) {
                expect(1).to.equal(2, `Test failed. An error has occurred. Message from server: ${response.msg}`);
                throw new Error(`Test failed. An error has occurred. Message from server: ${response.msg}`);
            }

            if ((response && typeof response.data === 'object' && response.data !== null && !("questions" in response.data)) || (response === null)) {
                expect(1).to.equal(2, "Test failed. Did not receive an array of questions from the server.");
                throw new Error("Test failed. Did not receive an array of questions from the server.");
            }

            const questions = (response.data as { questions: IQuestion[] }).questions;

            if (!questions.length) {
                throw new Error("The 'questions' array does not exist in the response received from the server.")
            }

            console.log("questions: ", questions)

            const areTheQuestionsCorrect = questions.every(question => {
                const { answer, sentence, choices } = question ?? {};

                if (typeof sentence !== "string") {
                    return false;
                }

                if (!Array.isArray(answer) || !answer.every(answerStr => typeof answerStr === 'string')) {
                    return false;
                }

                if (!Array.isArray(choices) || !choices.every(choice => (
                    getIsTValid<IChoice>(choice, "object", choice !== null) &&
                    getIsTValid<string>(choice.letter, "string") &&
                    getIsTValid<string>(choice.value, "string")
                ))) {
                    return false;
                }

                return true;
            });

            console.log("areTheQuestionsCorrect: ", areTheQuestionsCorrect)

            expect(areTheQuestionsCorrect).to.equal(true, "Checking if the form of the objects in the questions array is correct.")
        } catch (error) {
            console.error("An error has occurred in getting the predicate logic questions from the api. Error message: ", error);
            expect(1).to.equal(2)
        }

    })
})