import { View } from "react-native";
import { PTxt } from "../../global_components/text";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { TDifficulty } from "../../zustandStoreTypes&Interfaces";
import Layout from "../../global_components/Layout";
import Button from "../../global_components/Button";
import { TStackNavigation } from "../../Navigation";
import { useNavigation } from "@react-navigation/native";
import { useMathGameInfoStore } from "../../zustand";
import { useGetAppColors } from "../../custom_hooks/useGetAppColors";

const MathOptionsScrnPresentation = () => {
    const { navigate } = useNavigation<TStackNavigation>();
    const setMathGameInfoStore = useMathGameInfoStore(state => state.updateState);
    const difficulty = useMathGameInfoStore(state => state.difficulty);
    const appColor = useGetAppColors();

    function handleDifficulytBtnPress(difficulty: TDifficulty) {
        return () => {
            setMathGameInfoStore(difficulty, "difficulty")
        }
    }

    function handleMoreSettingBtnPress() {
        navigate("GameScrnSettings")
    }

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
                {/* put the difficulty choices here */}
                {/* easy, medium, hard  */}
                <View
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: 'row',
                        gap: 10
                    }}
                >
                    <Button
                        dynamicStyles={{
                            paddingVertical: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 100,
                            borderRadius: 15,
                            opacity: difficulty === "easy" ? .4 : 1
                        }}
                        backgroundColor={appColor.second}
                        handleOnPress={handleDifficulytBtnPress("easy")}

                    >
                        <PTxt style={{ textAlign: "center" }}>Easy</PTxt>
                        <PTxt style={{ marginTop: 10 }}>
                            <PTxt><FontAwesomeIcon icon={faStar} color="gold" /></PTxt>
                        </PTxt>
                    </Button>
                    <Button
                        handleOnPress={handleDifficulytBtnPress("med")}
                        dynamicStyles={{
                            paddingVertical: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 100,
                            borderRadius: 15,
                            opacity: difficulty === "med" ? .4 : 1
                        }}
                        backgroundColor={appColor.second}
                    >
                        <PTxt style={{ textAlign: "center" }}>Medium</PTxt>
                        <PTxt style={{ flexDirection: 'row', marginTop: 10 }}>
                            <PTxt><FontAwesomeIcon icon={faStar} color="gold" /></PTxt>
                            <PTxt><FontAwesomeIcon icon={faStar} color="gold" /></PTxt>
                        </PTxt>
                    </Button>
                    <Button
                        handleOnPress={handleDifficulytBtnPress("hard")}
                        dynamicStyles={{
                            paddingVertical: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 100,
                            borderRadius: 15,
                            opacity: difficulty === "hard" ? .4 : 1
                        }}
                        backgroundColor={appColor.second}
                    >
                        <PTxt style={{ textAlign: "center" }}>Hard</PTxt>
                        <PTxt style={{ flexDirection: 'row', marginTop: 10 }}>
                            <PTxt><FontAwesomeIcon icon={faStar} color="gold" /></PTxt>
                            <PTxt><FontAwesomeIcon icon={faStar} color="gold" /></PTxt>
                            <PTxt><FontAwesomeIcon icon={faStar} color="gold" /></PTxt>
                        </PTxt>
                    </Button>
                </View>
                <View>
                    <Button
                        handleOnPress={handleMoreSettingBtnPress}
                    >
                        <PTxt>More Settings</PTxt>
                    </Button>
                </View>
            </View>
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