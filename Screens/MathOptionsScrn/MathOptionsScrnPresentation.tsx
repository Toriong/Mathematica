import { View } from "react-native";
import Layout from "../../global_components/Layout";

const MathOptionsScrnPresentation = () => {

    return (
        <Layout
            style={{
                flex: 1,
                width: "100%",
                height: "100%",
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            <View
                style={{
                    width: "100%",
                    flex: .5
                }}
            >
                {/* put the math options here: Division, Multiplication, Addition, Subtraction, Binary */}
            </View>
        </Layout>
    );
};

export default MathOptionsScrnPresentation;