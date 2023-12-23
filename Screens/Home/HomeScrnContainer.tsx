import HomeScrnPresentation from "./HomeScrnPresentation";
import { SERVER_ORIGIN } from "../../api_services/globalApiVars";
import { useEffect } from "react";

// NOTES: 
// need to send the text of the question to the server in order to tell chat gpt not to copy the previous question text in its new question generation
// save those questions into the cache on the server 
// check if the HomeScrnContainer comp will re-render when the uesr navigates to the Home screen


// POINTS OFF CONTACT WITH THE /get-questions path

// on the first render of the Home screen component 

// whenever the user clicks on the submit button

const HomeScrnContainer = () => {

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(SERVER_ORIGIN);
                const data = await res.text();

                console.log("data yo there: ", data)
            } catch(error){
                console.error("An error has occurred in pinging the server: ", error)
            }
        })();
    }, []);

    return <HomeScrnPresentation />;
};

export default HomeScrnContainer;