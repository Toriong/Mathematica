import Layout from "../../global_components/Layout";
import { View, StyleSheet } from 'react-native';
import { HeadingTxt, PTxt } from "../../global_components/text";
import { useColorStore, useGameScrnTabStore } from "../../zustand";
import Button from "../../global_components/Button";
import { useGetAppColors } from "../../custom_hooks/useGetAppColors";
import { BORDER_RADIUS_NUM, PRIMARY_COLOR, SUCCESS_COLOR, WARNING_COLOR } from "../../globalVars";

// GOAL: for the nav, only present the following: 
// the back button
// Logica 
// "PLAY" button 

const BTN_FONT_SIZE = 22;
const PTXT_FONT_SIZE = 35;

const ResultsPresentation = () => {
    const rightNum = useGameScrnTabStore(state => state.right);
    const wrongNum = useGameScrnTabStore(state => state.wrong);
    const appColors = useGetAppColors();

    function handlePlayAgainBtnPress() {

    };

    function handleHomeBtnPress() {

    };

    function handleReviewBtnPress() {

    };

    return (
        <Layout>
            <View style={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center', flex: .6 }}>
                <HeadingTxt
                    fontSize={45}
                    txtColor={appColors.third}
                >
                    YOUR RESULTS:
                </HeadingTxt>
            </View>
            <View style={{ width: "100%", display: 'flex', alignItems: 'center', flex: 1, flexDirection: 'column', }}>
                <View
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    <PTxt
                        fontSize={PTXT_FONT_SIZE}
                        txtColor={appColors.third}
                        style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', width: "100%" }}
                    >
                        Score:
                    </PTxt>
                    <PTxt
                        fontSize={PTXT_FONT_SIZE}
                        txtColor={appColors.third}
                        style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', width: "100%" }}
                    >
                        {rightNum}
                    </PTxt>
                </View>
                <View
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: "8%" }}
                >
                    <PTxt fontSize={PTXT_FONT_SIZE} txtColor="green">
                        Right: {rightNum}
                    </PTxt>
                    <PTxt fontSize={PTXT_FONT_SIZE} txtColor='red'>
                        Wrong: {wrongNum}
                    </PTxt>
                </View>
            </View>
            <View style={{ width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <View style={{ display: 'flex', gap: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Button
                        backgroundColor={appColors.second}
                        handleOnPress={handleReviewBtnPress}
                        dynamicStyles={styles.button}
                    >
                        <PTxt fontSize={BTN_FONT_SIZE} txtColor={appColors.third}>
                            Review
                        </PTxt>
                    </Button>
                    <Button
                        backgroundColor={SUCCESS_COLOR}
                        handleOnPress={handlePlayAgainBtnPress}
                        dynamicStyles={styles.button}
                    >
                        <PTxt
                            fontSize={BTN_FONT_SIZE}
                            txtColor={appColors.third}
                            fontStyle="italic"
                            style={{ textAlign: 'center' }}
                        >
                            PLAY AGAIN!
                        </PTxt>
                    </Button>
                </View>
                <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 15 }}>
                    <Button
                        backgroundColor={PRIMARY_COLOR}
                        handleOnPress={handleHomeBtnPress}
                        dynamicStyles={styles.button}
                    >
                        <PTxt
                            fontSize={BTN_FONT_SIZE}
                            txtColor={appColors.third}
                            style={{ textAlign: 'center' }}
                        >
                            Leader Board
                        </PTxt>
                    </Button>
                    <Button
                        backgroundColor={WARNING_COLOR}
                        handleOnPress={handleHomeBtnPress}
                        dynamicStyles={styles.button}
                    >
                        <PTxt
                            fontSize={BTN_FONT_SIZE}
                            txtColor={appColors.third}>
                            Home
                        </PTxt>
                    </Button>
                </View>
            </View>
        </Layout>
    )
};

const styles = StyleSheet.create({
    button: {
        width: 125,
        height: 65,
        borderRadius: BORDER_RADIUS_NUM,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ResultsPresentation;