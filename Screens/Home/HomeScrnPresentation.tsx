import Layout from "../../global_components/Layout";
import { Alert, View } from 'react-native'
import { PTxt } from "../../global_components/text";
import { useNavigation } from '@react-navigation/native';
import { TScreenNames, TStackNavigation } from "../../Navigation";
import { useColorStore, useGameScrnTabStore, useMathGameStore, useQuestionsStore } from "../../zustand";
import Button from "../../global_components/Button";
import { Storage } from "../../utils/storage";
import { getUserId, sortRandomly } from "../../utils/generalFns";
import { getHasUserReachedQuizGenerationLimit } from "../../api_services/users/getHasUserReachedQuizGenerationLimit";
import { CustomError } from "../../utils/errors";
import { useState } from "react";
import { faAdd, faDivide, faMultiply, faSubtract } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../global_components/Icon";
import { TOperator } from "../../zustandStoreTypes&Interfaces";

const BTN_TXT_FONT_SZ = 23
const BTN_WIDTH = 225

const HomeScrnPresentation = () => {
    const navigation = useNavigation<TStackNavigation>();
    const appColors = useColorStore();
    const currentAppColors = appColors.themesObj[appColors.currentTheme];
    const setMathGameStore = useMathGameStore(state => state.updateState)
    const [isPlayLogicGameBtnDisabled, setIsPlayLogicGameBtnDisabled] = useState(false);

    function handleOnBtnPress(
        scrnName: TScreenNames,
        gameType: Exclude<TOperator, 'none'> | null = null
    ) {
        return () => {
            if ((scrnName === "MathGameSetupScrn") && gameType) {
                setMathGameStore(gameType, "gameType")
                navigation.navigate(scrnName)
            }

        }
    }

    return (
        <Layout>
            <View style={{ display: "flex", flexDirection: 'column', flex: 1 }}>
                <View style={{ flex: .3, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        isDisabled={isPlayLogicGameBtnDisabled}
                        dynamicStyles={{
                            width: 225,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                            borderRadius: 15,
                            opacity: isPlayLogicGameBtnDisabled ? .4 : 1
                        }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={handleOnBtnPress("MathGameSetupScrn", "+")}
                    >

                        <PTxt fontSize={BTN_TXT_FONT_SZ} style={{ textAlign: "center" }}>Addition</PTxt>
                        <Icon size={BTN_TXT_FONT_SZ} icon={faAdd} style={{ marginStart: 5 }} />
                    </Button>
                </View>
                <View
                    style={{
                        flex: .3,
                        width: "100%",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Button
                        dynamicStyles={{
                            width: BTN_WIDTH,
                            padding: 10,
                            borderRadius: 15,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={handleOnBtnPress('MathGameSetupScrn', '/')}
                    >
                        <PTxt fontSize={BTN_TXT_FONT_SZ} style={{ textAlign: "center" }}>Division</PTxt>
                        <Icon size={BTN_TXT_FONT_SZ} icon={faDivide} style={{ marginStart: 5 }} />
                    </Button>
                </View>
                <View
                    style={{ flex: .3, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        isDisabled={isPlayLogicGameBtnDisabled}
                        dynamicStyles={{
                            width: BTN_WIDTH,
                            padding: 10,
                            borderRadius: 15,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={handleOnBtnPress("MathGameSetupScrn", '*')}
                    >
                        <PTxt fontSize={BTN_TXT_FONT_SZ} style={{ textAlign: "center" }}>Multiplication</PTxt>
                        <Icon size={BTN_TXT_FONT_SZ} icon={faMultiply} style={{ marginStart: 5 }} />
                    </Button>
                </View>
                <View
                    style={{ flex: .3, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        isDisabled={isPlayLogicGameBtnDisabled}
                        dynamicStyles={{
                            width: BTN_WIDTH,
                            padding: 10,
                            borderRadius: 15,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={handleOnBtnPress("MathGameSetupScrn", '-')}
                    >
                        <PTxt fontSize={BTN_TXT_FONT_SZ} style={{ textAlign: "center" }}>Subtraction</PTxt>
                        <Icon size={BTN_TXT_FONT_SZ} icon={faSubtract} style={{ marginStart: 5 }} />
                    </Button>
                </View>
                <View
                    style={{ flex: .3, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        isDisabled={isPlayLogicGameBtnDisabled}
                        dynamicStyles={{
                            width: BTN_WIDTH,
                            padding: 10,
                            borderRadius: 15,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={handleOnBtnPress("BinaryScrn")}
                    >
                        <PTxt fontSize={BTN_TXT_FONT_SZ} style={{ textAlign: 'center' }}>Binary 010</PTxt>
                    </Button>
                </View>
            </View>
        </Layout>
    );
};

export default HomeScrnPresentation;