import { useEffect } from "react";
import { useGetInitialQs } from "../../custom_hooks/useGetInitialQs";
import { IQuestionOnClient } from "../../zustandStoreTypes&Interfaces";
import ResultsPresentation from "./ResultsPresentation"

const ResultContainer = () => {
    const [questionsForNextQuiz,] = useGetInitialQs<IQuestionOnClient>(true);

    useEffect(() => {
        console.log("questionsForNextQuiz: ", questionsForNextQuiz)
    })

    return <ResultsPresentation questionsForNextQuiz={questionsForNextQuiz} />;
}

export default ResultContainer