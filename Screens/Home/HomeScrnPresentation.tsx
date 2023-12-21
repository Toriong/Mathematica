import Layout from "../../global_components/Layout";
import { View } from 'react-native'
import { PTxt } from "../../global_components/text";
import { useNavigation } from '@react-navigation/native';
import {  TScreenNames, TStackNavigation } from "../../Navigation";
import Button from "../../global_components/Button";
import { useColorStore } from "../../zustand";



const HomeScrnPresentation = () => {
    const navigation = useNavigation<TStackNavigation>();
    const appColors = useColorStore();
    const currentAppColors = appColors.themesObj[appColors.currentTheme];

    function handleOnBtnPress(scrnName: TScreenNames) {
        navigation.navigate(scrnName)
    }



    return (
        <Layout>
            <View>
                <Button backgroundColor={currentAppColors.second} handleOnPress={_ => { handleOnBtnPress("GameScreen") }}>
                    <PTxt>Propositional</PTxt>
                </Button>
                {/* Propositional */}
                {/* Predicate */}
                {/* Diagrams */}
                {/* ALL */}
            </View>
        </Layout>
    );
};

export default HomeScrnPresentation;