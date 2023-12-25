import HomeScrnPresentation from "./HomeScrnPresentation";
import { SERVER_ORIGIN } from "../../api_services/globalApiVars";
import { useEffect } from "react";
import { useApiQsFetchingStatusStore } from "../../zustand";
import { TPromiseReturnValGetQuestions, getQuestions } from "../../api_services/questions";
import { IQuestion } from "../../zustandStoreTypes&Interfaces";
import { Storage } from "../../utils/storage";
import { IS_TESTING, TESTING_USER_ID } from "../../globalVars";



// NOTES: 
// need to send the text of the question to the server in order to tell chat gpt not to copy the previous question text in its new question generation
// save those questions into the cache on the server 
// check if the HomeScrnContainer comp will re-render when the uesr navigates to the Home screen


// POINTS OFF CONTACT WITH THE /get-questions path

// on the first render of the Home screen component 

// whenever the user clicks on the submit button

// Getting the first five questions from the server: 
// 1) get it on the first render of the HomeScrnContainer comp
// -have it within the useEffect within this component
// -create a global zustand state, boolean toggle to get the questions. If the state is true, then get the questions. 
// 2) get it when the user presses on a button to navigate to the Home screen
// -will use more code? Can create a function for this. 
// -invoke the function on every instance that the user will go the Home screen
// -still need to invoke the function within the HomeScrnContainer component is on the UI in order to get the questions on the first render of this 
// component

// Need to get the questions when the user is on the Home screen. 

const HomeScrnContainer = () => {
    const memory = new Storage();
    const willGetQs = useApiQsFetchingStatusStore(state => state.willGetQs);
    const updateApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);

    useEffect(() => {
        if (willGetQs) {
            updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus");
            console.log("yo there meng...");
            (async () => {
                try {
                    let userId = await memory.getItem("userId");
                    userId = IS_TESTING ? TESTING_USER_ID : userId;
                    const responseGetPropostionalQs = getQuestions<IQuestion[]>(3, ["propositional"], userId as string);
                    const responseGetPredicateQs = getQuestions<IQuestion[]>(3, ["predicate"], userId as string)
                    const responses: Awaited<TPromiseReturnValGetQuestions<IQuestion[]>>[] = await Promise.all([responseGetPropostionalQs, responseGetPredicateQs]);
                    console.log("responses: ", responses);
                    updateApiQsFetchingStatusStore("SUCCESS", "gettingQsResponseStatus");
                } catch (error) {
                    console.error("Failed to get questions from the server. Error message: ", error)
                    updateApiQsFetchingStatusStore("FAILURE", "gettingQsResponseStatus");
                } finally {
                    updateApiQsFetchingStatusStore(false, "willGetQs");
                }
            })();
        }
    }, [willGetQs]);

    return <HomeScrnPresentation />;
};

export default HomeScrnContainer;