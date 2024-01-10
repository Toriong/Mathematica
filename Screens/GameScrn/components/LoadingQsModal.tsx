import { useEffect, useState } from "react";
import { PTxt } from "../../../global_components/text";
import { ActivityIndicator, View } from "react-native";
import { useApiQsFetchingStatusStore, useGameScrnTabStore } from "../../../zustand";
import { useGetAppColors } from "../../../custom_hooks/useGetAppColors";
import Modal from "react-native-modal";
import Button from "../../../global_components/Button";

const LoadingQsModal = () => {
    const gettingQsStatus = useApiQsFetchingStatusStore(state => state.gettingQsResponseStatus);
    const updateApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
    const mode = useGameScrnTabStore(state => state.mode);
    const [isModalVisible, setIsModalVisible] = useState((gettingQsStatus === "IN_PROGRESS") || (gettingQsStatus === "FAILURE"));
    const appColors = useGetAppColors();

    function handleOnPress() {
        updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus")
        updateApiQsFetchingStatusStore(true, "willGetQs");
    }

    function closeModal(millis = 1000) {
        setTimeout(() => {
            setIsModalVisible(false);
        }, millis);
    }

    useEffect(() => {
        if ((mode === "quiz") && (gettingQsStatus === "IN_PROGRESS") || (gettingQsStatus === "FAILURE")) {
            setIsModalVisible(true);
        } else if ((mode === "quiz") && (gettingQsStatus === "SUCCESS") && isModalVisible) {
            closeModal();
        }
    }, [gettingQsStatus, mode])

    return (
        <Modal
            isVisible={isModalVisible}
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
                    <View
                        style={{
                            display: "flex",
                            width: "100%",
                            marginTop: 10,
                            height: 100,
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
                            <Button
                                backgroundColor={appColors.second}
                                handleOnPress={handleOnPress}
                                dynamicStyles={{
                                    padding: 17,
                                    borderRadius: 15,
                                    marginTop: 25
                                }}
                            >
                                <PTxt fontSize={20}>
                                    Press Get Questions.
                                </PTxt>
                            </Button>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default LoadingQsModal;