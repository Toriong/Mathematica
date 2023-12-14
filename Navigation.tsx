import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GameScrnContainer from './Screens/GameScrn/GameScrnContainer';
import GameScrnTab from './global_components/tab_navs/GameScrnTab';
import { Text } from 'react-native';
import SafeAreaViewWrapper from './global_components/SafeAreaViewWrapper';
import { OVERLAY_OPACITY } from './globalVars';
import { useGameScrnTabStore } from './zustand';
import ResultContainer from './Screens/Results/ResultsContainer';

const Tab = createMaterialTopTabNavigator();
const navTabs = [
    {
        name: 'GameScreen',
        comp: GameScrnTab
    },
    {
        name: "ResultsScreen",
        comp: GameScrnTab
    }
];

const LogicGameAppNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="ResultsScreen"
                tabBar={props => {
                    const state = props.navigation.getState();
                    const { name: currentRouteName } = state.routes[state.index];
                    const { comp: TabBar } = navTabs.find(({ name }) => name === currentRouteName) ?? {};

                    if (!TabBar) {
                        return (
                            <View style={{ backgroundColor: "pink", height: 100 }}>

                            </View>
                        )
                    }

                    return <TabBar {...props} />
                }}

            >
                <Tab.Screen name="GameScreen" component={GameScrnContainer} />
                <Tab.Screen name="ResultsScreen" component={ResultContainer} />
            </Tab.Navigator>
        </NavigationContainer>
    )
};

export default LogicGameAppNavigation;