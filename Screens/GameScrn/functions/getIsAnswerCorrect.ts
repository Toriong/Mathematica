
export function getIsAnswerCorrect(userAnswerSymbols: string[], correctAnswerSymbols: string[]) {
    let isAnswerCorrect = true;

    for (let index = 0; index <= userAnswerSymbols.length; index++) {
        let userAnswerSymbol = userAnswerSymbols[index];
        let correctAnswerSymbol = correctAnswerSymbols[index];

        if (userAnswerSymbol !== correctAnswerSymbol) {
            isAnswerCorrect = false;
            break;
        }
    }

    return isAnswerCorrect;
}