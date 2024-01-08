import { useEffect, useState } from "react";
import { PTxt } from "../../../global_components/text";
import { ActivityIndicator, View } from "react-native";
import { useApiQsFetchingStatusStore } from "../../../zustand";
import { useGetAppColors } from "../../../custom_hooks/useGetAppColors";
import Modal from "react-native-modal";

const LoadingQsModal = () => {
    const gettingQsStatus = useApiQsFetchingStatusStore(state => state.gettingQsResponseStatus);
    const [isModalVisible, setIsModalVisible] = useState(gettingQsStatus === "IN_PROGRESS");
    const appColors = useGetAppColors();

    useEffect(() => {
        if (gettingQsStatus === "IN_PROGRESS") {
            setIsModalVisible(true);
        } else {
            setTimeout(() => {
                // start the timer when the questions has been received. 
                setIsModalVisible(false);
            }, 1000)
        };
    }, [gettingQsStatus])

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
                            textAlign: 'center'
                        }}
                    >
                        {gettingQsStatus === "IN_PROGRESS"
                            ?
                            "Getting questions..."
                            :
                            "Questions received!"
                        }
                    </PTxt>
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
                        {gettingQsStatus === "IN_PROGRESS" ?
                            <ActivityIndicator
                                size="large"
                                style={{ transform: [{ scale: 2 }] }}
                            />
                            :
                            <PTxt
                                fontSize={40}
                                style={{ textAlign: "center", }}
                            >
                                ✅
                            </PTxt>
                        }
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default LoadingQsModal;