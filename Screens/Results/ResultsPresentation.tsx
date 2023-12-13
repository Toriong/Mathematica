import Layout from "../../global_components/Layout";
import { View } from 'react-native';

// GOAL: for the nav, only present the following: 
// the back button
// Logica 
// "PLAY" button  

const ResultsPresentation = () => {
    return (
        <Layout>
            <View>
                {/* put the title here: RESULTS */}
            </View>
            <View>
                {/* put the right and wrong here */}
            </View>
            <View>
                {/* put the following button here; */}
                {/* Review */}
                {/* Play Again */}
                {/* Home */}
            </View>
        </Layout>
    )
};

export default ResultsPresentation;