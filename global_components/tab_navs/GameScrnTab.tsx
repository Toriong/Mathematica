import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { View, SafeAreaView, GestureResponderEvent } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useColorStore } from "../../zustand";
import Button from "../Button";



const GameScrnTab = (props: MaterialTopTabBarProps) => {
    // notes: 
    // get the currentTheme
    // after getting the current themem, get the themesObj and query hte object using the string from currentTheme
    const currentTheme = useColorStore(state => state.currentTheme);
    const colorThemesObj = useColorStore(state => state.themesObj);
    const currentThemeObj = colorThemesObj[currentTheme];

    function handleBtnPress(event: GestureResponderEvent) {

    }

    return (
        <SafeAreaView style={{ width: "100%", display: 'flex', backgroundColor: currentThemeObj.first, flex: .13 }}>
            {/* this View container will contain the following: */}

            {/* START OF row 1 (flex, row) */}
            {/* view */}
            {/* back arrow */}
            {/* view */}

            {/* START of view (flex, flex-column)*/}
            {/* right (number) | wrong (number) */}
            {/* timer */}
            {/* END of view */}
            {/* END OF row 1 */}

            {/* START of row 2 */}
            {/* Score: (tracker for the score, number) */}
            {/* END of row 2 */}
            <View style={{ display: 'flex', flexDirection: 'row',width: "100%" }}>
                <View style={{ height: '100%', width: "30%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button handleOnPress={handleBtnPress}>
                        <View style={{ borderWidth: 3, borderColor: currentThemeObj.second, borderRadius: 50, padding: 8 }}>
                            <FontAwesomeIcon icon={faArrowLeft} size={50} color={currentThemeObj.second} />
                        </View>
                    </Button>
                </View>
                <View style={{ width: "70%", height: "100%" }}>

                </View>
            </View>
        </SafeAreaView>
    );
};

export default GameScrnTab;