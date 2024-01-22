import { useEffect, useState } from "react";
import { PTxt } from "../../../global_components/text";
import { ActivityIndicator, View } from "react-native";
import { useApiQsFetchingStatusStore, useGameScrnTabStore } from "../../../zustand";
import { useGetAppColors } from "../../../custom_hooks/useGetAppColors";
import Modal from "react-native-modal";
import Button from "../../../global_components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TStackNavigationProp } from "../../../Navigation";
import { TStateSetter } from "../../../globalTypes&Interfaces";

const LoadingQsModal = ({ _wasSkipBtnPressed, isThereAQToDisplay }: { _wasSkipBtnPressed: [boolean, TStateSetter<boolean>], isThereAQToDisplay: boolean }) => {
    const navigation = useNavigation<TStackNavigationProp>();
    // make the route name type safe
    const route = useRoute();
    const gettingQsStatus = useApiQsFetchingStatusStore(state => state.gettingQsResponseStatus);
    const mode = useGameScrnTabStore(state => state.mode);
    const updateApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
    const updateGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
    const willNotShowLoadingModal = useGameScrnTabStore(state => state.willNotShowLoadingModal);
    const [isModalVisible, setIsModalVisible] = useState((gettingQsStatus === "IN_PROGRESS") || (gettingQsStatus === "FAILURE"));
    const appColors = useGetAppColors();
    const [wasSkipBtnPressed, setWasSkipBtnPressed] = _wasSkipBtnPressed;

    function handleGetMoreQsBtnPress() {
        if (wasSkipBtnPressed) {
            setWasSkipBtnPressed(true);
        }

        updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus")
        updateApiQsFetchingStatusStore(true, "willGetQs");
    };

    function handleBackToMainScreenBtnPress() {
        setIsModalVisible(false);
        navigation.navigate("Home")
    }

    function handleOnGoBackMainScrnBtnPress() {
        setIsModalVisible(false);
        navigation.navigate("Home");

        setTimeout(() => {
            updateApiQsFetchingStatusStore(true, "willGetQs");
            updateGameScrnTabStore("finished", "mode");
            updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus");
        }, 800)
    };

    useEffect(() => {
        console.log("mode: ", mode);

        if (
            ((mode === 'quiz') && (((route.name === "GameScreen") && (gettingQsStatus === "IN_PROGRESS") ||
                (gettingQsStatus === "FAILURE")) || !isThereAQToDisplay))
        ) {
            console.log("will open modal...")
            setIsModalVisible(true);
        } else if (
            (["quiz", "finished"].includes(mode) || (route.name !== "GameScreen")) &&
            (["FAILURE", "SUCCESS"].includes(gettingQsStatus) && isModalVisible)
        ) {
            console.log("will close modal...")
            setTimeout(() => {
                setIsModalVisible(false);
            }, 1000);
        }
    }, [gettingQsStatus, mode, route.name, isThereAQToDisplay])

    return (
        <Modal
            isVisible={isModalVisible}
            onBackdropPress={(gettingQsStatus === "SUCCESS") ? () => { setIsModalVisible(false); } : () => {}}
        >
            <View
                style={{
                    backgroundColor: appColors.first,
                    flex: .7,
                    borderRadius: 10
                }}
            >
                <View
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1
                    }}
                >
                    <PTxt
                        fontSize={25}
                        style={{
                            textAlign: 'center',
                            paddingHorizontal: 35
                        }}
                    >
                        {(gettingQsStatus === "IN_PROGRESS") && "Getting questions..."}
                        {(gettingQsStatus === "SUCCESS") && "Questions received!"}
                    </PTxt>
                    {(gettingQsStatus === "FAILURE") && (
                        <>
                            <PTxt
                                fontSize={25}
                                style={{ textAlign: 'center', padding: 17 }}
                            >
                                Failed to generate questions 👎.
                            </PTxt>
                            <PTxt
                                fontSize={25}
                                style={{ textAlign: 'center' }}
                            >
                                Please try again.
                            </PTxt>
                        </>
                    )}
                    {(gettingQsStatus === "IN_PROGRESS") && (
                        <Button
                            backgroundColor={appColors.second}
                            handleOnPress={handleOnGoBackMainScrnBtnPress}
                            dynamicStyles={{
                                padding: 17,
                                width: 170,
                                borderRadius: 15,
                                marginTop: 25
                            }}
                        >
                            <PTxt
                                fontSize={20}
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                Back to main screen.
                            </PTxt>
                        </Button>
                    )}
                    <View
                        style={{
                            display: "flex",
                            width: "100%",
                            marginTop: 10,
                            height: 100,
                            flex: .5,
                            justifyContent: "center",
                            alignItems: 'center'
                        }}
                    >
                        {(gettingQsStatus === "IN_PROGRESS") && (

                            <ActivityIndicator
                                size="large"
                                style={{ transform: [{ scale: 2 }] }}
                            />
                        )}
                        {(gettingQsStatus === "SUCCESS") && (
                            <PTxt
                                fontSize={40}
                                style={{ textAlign: "center" }}
                            >
                                ✅
                            </PTxt>
                        )}
                        {(gettingQsStatus === "FAILURE") && (
                            <View
                                style={{ flexDirection: "column", justifyContent: 'center', alignItems: "center", width: "100%" }}
                            >
                                <Button
                                    backgroundColor={appColors.second}
                                    handleOnPress={handleGetMoreQsBtnPress}
                                    dynamicStyles={{
                                        padding: 17,
                                        borderRadius: 15,
                                        marginTop: 25
                                    }}
                                >
                                    <PTxt fontSize={20}>
                                        Press to get questions.
                                    </PTxt>
                                </Button>
                                <Button
                                    backgroundColor={appColors.second}
                                    handleOnPress={handleOnGoBackMainScrnBtnPress}
                                    dynamicStyles={{
                                        padding: 17,
                                        width: 170,
                                        borderRadius: 15,
                                        marginTop: 25
                                    }}
                                >
                                    <PTxt
                                        fontSize={20}
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >
                                        Back to main screen.
                                    </PTxt>
                                </Button>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default LoadingQsModal;