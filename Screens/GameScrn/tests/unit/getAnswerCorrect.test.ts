import { expect } from "chai"
import { getIsAnswerCorrect } from "../../functions/getIsAnswerCorrect";

describe("Getting questions from the backend.", () => {
    it.only("Running the implementation of `getIsAnswerCorrect` function.", () => {
        const userAnswer = ["(", "x", ")","(", "(", "C", "x", "*", "B", "x", ")", "->", "V", "x", ")"]    
        const correctAnswer = ["(", "x", ")","(", "(", "C", "x", "*", "B", "x", ")", "->", "V", "x", ")"]
        const userAnswer2 = ["(", "x", ")","(", "(", "T", "x", "*", "F", "x", ")", "->", "P", "x", ")"]    
        const correctAnswer2 = ["(", "x", ")","(", "(", "T", "x", "*", "F", "x", ")", "->", "P", "x", ")"]
        const isAnswerCorrect = getIsAnswerCorrect(userAnswer, correctAnswer);      
        const isAnswerCorrectResult2 = getIsAnswerCorrect(userAnswer2, correctAnswer2);      
        expect(isAnswerCorrect).to.equal(true);
        expect(isAnswerCorrectResult2).to.equal(true);
    })
})