import { expect } from "chai"
import { getIsAnswerCorrect } from "../../functions/getIsAnswerCorrect";

describe("Getting questions from the backend.", () => {
    it.only("Running the implementation of `getIsAnswerCorrect` function.", () => {
        const userAnswer = ["(", "x", ")","(", "(", "C", "x", "*", "B", "x", ")", "->", "V", "x", ")"]    
        const correctAnswer = ["(", "x", ")","(", "(", "C", "x", "*", "B", "x", ")", "->", "V", "x", ")"]
        const isAnswerCorrect = getIsAnswerCorrect(userAnswer, correctAnswer);      
        expect(isAnswerCorrect).to.equal(true);
    })
})