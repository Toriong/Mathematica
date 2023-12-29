import { NavigationContainer, NavigationProp, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator, } from '@react-navigation/material-top-tabs';
import GameScrnContainer from './Screens/GameScrn/GameScrnContainer';
import GameScrnTab from './global_components/tab_navs/top/GameScrnTab';
import ResultContainer from './Screens/Results/ResultsContainer';
import ResultsScrnTab from './global_components/tab_navs/top/ResultsScrnTab';
import HomeScrnContainer from './Screens/Home/HomeScrnContainer';
import HomeScrnTab from './global_components/tab_navs/top/HomeScrnTab';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createStackNavigator();
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
            <Stack.Navigator
                initialRouteName='Home'
                screenOptions={{
                    header: ({ route,  }) => {
                        return <HomeScrnTab />
                    }
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScrnContainer}
                />
                <Stack.Screen
                    name="GameScreen"
                    component={GameScrnContainer}
                />
                <Stack.Screen
                    name="ResultsScreen"
                    component={ResultContainer}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
};

export default LogicGameAppNavigation;