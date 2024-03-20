import { SafeAreaView, View } from 'react-native'
import Button from '../../Button'
import { useGetAppColors } from '../../../custom_hooks/useGetAppColors';
import { useColorStore, useMathGameInfoStore } from '../../../zustand';
import { TStackNavigation } from '../../../Navigation';
import { useNavigation } from '@react-navigation/native';
import { TDifficulty } from '../../../zustandStoreTypes&Interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { PTxt } from '../../text';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import SafeAreaViewWrapper from '../../SafeAreaViewWrapper';


const MathScrnOptionsTab = () => {
    const { navigate } = useNavigation<TStackNavigation>();
    const setMathGameInfoStore = useMathGameInfoStore(state => state.updateState);
    const difficulty = useMathGameInfoStore(state => state.difficulty);
    const { currentThemeObj } = useGetAppColors();

    function handleDifficulytBtnPress(difficulty: TDifficulty) {
        return () => {
            setMathGameInfoStore(difficulty, "difficulty")
        }
    }

    function handleMoreSettingBtnPress() {
        navigate("GameScrnSettings")
    }

    return (
        <SafeAreaViewWrapper>
            <SafeAreaView
                style={{
                    width: "100%",
                    position: 'relative',
                    display: 'flex',
                    backgroundColor: currentThemeObj.first,
                    borderBottomColor: currentThemeObj.second,
                    borderWidth: 1
                }}
            >
                <View
                    style={{
                        width: "100%",
                        flex: .5
                    }}
                >
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
                            backgroundColor={currentThemeObj.second}
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
                            backgroundColor={currentThemeObj.second}
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
                            backgroundColor={currentThemeObj.second}
                        >
                            <PTxt style={{ textAlign: "center" }}>Hard</PTxt>
                            <PTxt style={{ flexDirection: 'row', marginTop: 10 }}>
                                <PTxt><FontAwesomeIcon icon={faStar} color="gold" /></PTxt>
                                <PTxt><FontAwesomeIcon icon={faStar} color="gold" /></PTxt>
                                <PTxt><FontAwesomeIcon icon={faStar} color="gold" /></PTxt>
                            </PTxt>
                        </Button>
                    </View>
                    <View
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-start",
                        }}
                    >
                        <Button
                            handleOnPress={handleMoreSettingBtnPress}
                        >
                            <PTxt>More Settings</PTxt>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaViewWrapper>
    )
}

export default MathScrnOptionsTab