import { SafeAreaView, View } from 'react-native'
import Button from '../../Button'
import { useGetAppColors } from '../../../custom_hooks/useGetAppColors';
import { useColorStore, useMathGameStore } from '../../../zustand';
import { TStackNavigation } from '../../../Navigation';
import { useNavigation } from '@react-navigation/native';
import { TDifficulty } from '../../../zustandStoreTypes&Interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { HeadingTxt, PTxt } from '../../text';
import { faArrowCircleLeft, faArrowLeft, faArrowLeftRotate, faStar } from '@fortawesome/free-solid-svg-icons';
import SafeAreaViewWrapper from '../../SafeAreaViewWrapper';
import TabWrapper from '../../TabWrapper';
import { Icon } from '../../Icon';


const MathScrnOptionsTab = () => {
    const { navigate } = useNavigation<TStackNavigation>();
    const setMathGameStore = useMathGameStore(state => state.updateState);
    const difficulty = useMathGameStore(state => state.difficulty);
    const { currentThemeObj } = useGetAppColors();

    function handleDifficulytBtnPress(difficulty: TDifficulty) {
        return () => {
            setMathGameStore(difficulty, "difficulty")
        }
    }

    function handleBackBtnPress() {
        navigate('Home')
    }

    return (
        <TabWrapper
            style={{
                flexDirection: 'row',
                width: '100%',
                position: 'relative',
                display: 'flex',
                height: 200
            }}
        >
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                }}
            >
                <View
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: 'column',
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            flex: .1,
                            paddingStart: 15
                        }}
                    >
                        <Button
                            handleOnPress={handleBackBtnPress}
                            style={{ marginStart: 15 }}
                        >
                            <Icon
                                icon={faArrowCircleLeft}
                                color='#767577'
                                size={26}
                            />
                        </Button>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            flex: .3,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <HeadingTxt
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                textAlign: 'center'
                            }}
                            fontSize={31}
                        >
                            Set Up Game & Play!
                        </HeadingTxt>
                    </View>
                    <View
                        style={{
                            width: '100%',
                            flex: .5,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: 10,
                            marginTop: 10
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
                </View>
            </View>
        </TabWrapper>
    )
}

export default MathScrnOptionsTab