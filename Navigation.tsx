import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GameScrnContainer from './Screens/GameScrn/GameScrnContainer';
import GameScrnTab from './global_components/tab_navs/GameScrnTab';
import { Text } from 'react-native';
import SafeAreaViewWrapper from './global_components/SafeAreaViewWrapper';
import { OVERLAY_OPACITY } from './globalVars';

const Tab = createMaterialTopTabNavigator();
const navTabs = [{ name: 'GameScreen', comp: GameScrnTab }];

const LogicGameAppNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator tabBar={props => {
                const state = props.navigation.getState();
                const { name: currentRouteName } = state.routes[state.index];
                const { comp: TabBar } = navTabs.find(({ name }) => name === currentRouteName) ?? {};

                if (!TabBar) {
                    return (
                        <View style={{ backgroundColor: "pink", height: 100 }}>

                        </View>
                    )
                }

                // create an array that will hold all of the Tab views that will be rendered onto the DOM

                return (
                    <SafeAreaViewWrapper
                        layoutStyle={{ position: 'relative' }}
                        OverlayComp={
                            <View
                                style={{ width: '100%', height: '100%', backgroundColor: 'black', position: 'absolute', zIndex: 1, opacity: OVERLAY_OPACITY }}
                            >

                            </View>
                        }
                    >
                        <TabBar {...props} />
                    </SafeAreaViewWrapper>
                )
            }}>
                <Tab.Screen name="GameScreen" component={GameScrnContainer} />
            </Tab.Navigator>
        </NavigationContainer>
    )
};

export default LogicGameAppNavigation;