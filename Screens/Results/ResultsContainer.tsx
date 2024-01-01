import { useGetInitialQs } from "../../custom_hooks/useGetInitialQs";
import ResultsPresentation from "./ResultsPresentation"


const ResultContainer = () => {
    useGetInitialQs(true);

    return <ResultsPresentation />;
}

export default ResultContainer