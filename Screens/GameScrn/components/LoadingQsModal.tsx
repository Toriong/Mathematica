import { useEffect, useRef, useState } from "react";
import { PTxt } from "../../../global_components/text";
import { useApiQsFetchingStatusStore, useColorStore, } from "../../../zustand";
import { ActivityIndicator, View } from "react-native";
import Modal from "react-native-modal";


const LoadingQsModal = () => {
    const gettingQsStatus = useApiQsFetchingStatusStore(state => state.gettingQsResponseStatus);
    const [isModalShown, setIsModalShown] = useState(gettingQsStatus === "IN_PROGRESS");
    const colorsObj = useColorStore();
    const appColors = colorsObj.themesObj[colorsObj.currentTheme]
    const didInitialRenderOccur = useRef(false);

    useEffect(() => {
        if (gettingQsStatus === "IN_PROGRESS") {
            setIsModalShown(true);
        } else {
            setTimeout(() => {
                setIsModalShown(false);
            }, 1000)
        };
    }, [gettingQsStatus])

    return (
        <Modal
            isVisible={isModalShown}
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