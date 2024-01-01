import Layout from "../../global_components/Layout";
import { View } from 'react-native'
import { PTxt } from "../../global_components/text";
import { useNavigation } from '@react-navigation/native';
import { TScreenNames, TStackNavigation } from "../../Navigation";
import { useColorStore } from "../../zustand";
import Modal from "react-native-modal";
import Button from "../../global_components/Button";
import { Storage } from "../../utils/storage";

const HomeScrnPresentation = () => {
    const navigation = useNavigation<TStackNavigation>();
    const appColors = useColorStore();
    const memory = new Storage();
    const currentAppColors = appColors.themesObj[appColors.currentTheme];

    function handleOnBtnPress(scrnName: TScreenNames) {
        memory.setItem("isGameOn", true);
        navigation.navigate(scrnName)
    }

    return (
        <Layout>
            <View style={{ display: "flex", flexDirection: 'column', flex: 1 }}>
                <View style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={_ => { handleOnBtnPress("GameScreen") }}
                    >

                        <PTxt>PROPOSITIONAL</PTxt>
                    </Button>
                </View>
                <View
                    style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second}
                        handleOnPress={_ => { handleOnBtnPress("GameScreen") }}
                    >
                        <PTxt>PREDICATE</PTxt>
                    </Button>
                </View>
                <View
                    style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second} handleOnPress={_ => { handleOnBtnPress("GameScreen") }}
                    >
                        <PTxt>DIAGRAMS</PTxt>
                    </Button>
                </View>
                <View
                    style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Button
                        dynamicStyles={{ padding: 10, borderRadius: 15 }}
                        backgroundColor={currentAppColors.second} handleOnPress={_ => { handleOnBtnPress("GameScreen") }}
                    >
                        <PTxt>ALL</PTxt>
                    </Button>
                </View>
            </View>
        </Layout>
    );
};

export default HomeScrnPresentation;