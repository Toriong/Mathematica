import Layout from "../../global_components/Layout";
import { View } from 'react-native'
import { PTxt } from "../../global_components/text";
import { useNavigation } from '@react-navigation/native';
import { TScreenNames, TStackNavigation } from "../../Navigation";
import { useColorStore, useGameScrnTabStore } from "../../zustand";
import Button from "../../global_components/Button";
import { Storage } from "../../utils/storage";
import { useEffect, useState } from "react";

const HomeScrnPresentation = () => {
    const navigation = useNavigation<TStackNavigation>();
    const updateGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
    const appColors = useColorStore();
    const memory = new Storage();
    const currentAppColors = appColors.themesObj[appColors.currentTheme];

    async function handleOnBtnPress(
        scrnName: TScreenNames,
        types: Exclude<Parameters<typeof updateGameScrnTabStore>[0], number | boolean>
    ) {
        // when get more questions after the user responds to a question, check if the test is still going when a recursive call is being
        // implemented
        await memory.setItem("isGameOn", true);
        updateGameScrnTabStore(types, "questionTypes");
        updateGameScrnTabStore("quiz", "mode");
        console.log("yo there, will go to " + scrnName)
        navigation.navigate(scrnName)
    }

    const [isModalVisible, setIsModalVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsModalVisible(false)
        }, 2000)
    })

    return (
        <Layout>
            <View style={{ display: "flex", flexDirection: 'column', flex: 1 }}>
                <View style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        isDisabled={false}
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={async _ => { await handleOnBtnPress("GameScreen", ["propositional", "predicate"]) }}
                    >

                        <PTxt>PROPOSITIONAL</PTxt>
                    </Button>
                </View>
                <View
                    style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        isDisabled={false}
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={async _ => { await handleOnBtnPress("GameScreen", ["predicate"]) }}
                    >
                        <PTxt>PREDICATE</PTxt>
                    </Button>
                </View>
                <View
                    style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        isDisabled={false}
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second} handleOnPress={async _ => { await handleOnBtnPress("GameScreen", ["diagrams"]) }}
                    >
                        <PTxt>DIAGRAMS</PTxt>
                    </Button>
                </View>
                <View
                    style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        isDisabled={false}
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second} handleOnPress={async _ => { await handleOnBtnPress("GameScreen", ["diagrams", "predicate", "propositional"]) }}
                    >
                        <PTxt>ALL</PTxt>
                    </Button>
                </View>
            </View>
        </Layout>
    );
};

export default HomeScrnPresentation;