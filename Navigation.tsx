import { NavigationContainer, NavigationProp, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GameScrnContainer from './Screens/GameScrn/GameScrnContainer';
import GameScrnTab from './global_components/tab_navs/top/GameScrnTab';
import ResultContainer from './Screens/Results/ResultsContainer';
import ResultsScrnTab from './global_components/tab_navs/top/ResultsScrnTab';
import HomeScrnContainer from './Screens/Home/HomeScrnContainer';
import HomeScrnTab from './global_components/tab_navs/top/HomeScrnTab';

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
        comp: HomeScrnTab
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
                <Tab.Screen options={{ swipeEnabled: false }} name="Home" component={HomeScrnContainer} />
                <Tab.Screen  options={{ swipeEnabled: false,  }} name="GameScreen" component={GameScrnContainer} />
                <Tab.Screen options={{ swipeEnabled: false }} name="ResultsScreen" component={ResultContainer} />
            </Tab.Navigator>
        </NavigationContainer>
    )
};

export default LogicGameAppNavigation;