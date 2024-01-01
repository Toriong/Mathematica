import { useGetInitialQs } from "../../custom_hooks/useGetInitialQs";
import { IQuestionOnClient } from "../../zustandStoreTypes&Interfaces";
import ResultsPresentation from "./ResultsPresentation"


const ResultContainer = () => {
    const [questionsForNextQuiz,] = useGetInitialQs<IQuestionOnClient>(true);

    return <ResultsPresentation questionsForNextQuiz={questionsForNextQuiz} />;
}

export default ResultContainer