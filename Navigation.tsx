import { NavigationContainer, NavigationProp, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GameScrnContainer from './Screens/GameScrn/GameScrnContainer';
import GameScrnTab from './global_components/tab_navs/GameScrnTab';
import ResultContainer from './Screens/Results/ResultsContainer';
import ResultsScrnTab from './global_components/tab_navs/ResultsScrnTab';
import HomeScrnContainer from './Screens/Home/HomeScrnContainer';

const Tab = createMaterialTopTabNavigator();
const navTabs = [
    {
        name: 'GameScreen',
        comp: GameScrnTab
    },
    {
        name: "ResultsScreen",
        comp: ResultsScrnTab
    },
    {
        name: "Home",
        // GOAL: create the Home Tab for the Home screen.
        comp: GameScrnTab
    }
] as const;

export type TScreenNames = typeof navTabs[number]['name'];
export type TRootStackParamList = Record<TScreenNames[number], undefined>;
export type TStackNavigation = NavigationProp<TRootStackParamList>;



const LogicGameAppNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Home"
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
                <Tab.Screen name="Home" component={HomeScrnContainer} />
            </Tab.Navigator>
        </NavigationContainer>
    )
};

export default LogicGameAppNavigation;