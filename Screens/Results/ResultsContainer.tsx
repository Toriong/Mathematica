import ResultsPresentation from "./ResultsPresentation"

// NOTES: 
// to get the next batch of questions, do the following: 
// within the zustand store that keeps tracks of getting the questions from the server, change
// willGetQuestionsForNextGame to true
// if true, then within the useGetInitialQs hook, store the questions from the server within the state of 
// questionsForNextGame in the questionsStore 

// when the quiz is done, in the logic that takes the user to the results screen,
// set willGetQuestionsForNextQuiz to true
// clear the cache on the server when getting the questions from the server

const ResultContainer = () => {
    return <ResultsPresentation />;
}

export default ResultContainer