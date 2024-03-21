import { NavigationContainer, NavigationProp, ParamListBase } from '@react-navigation/native';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import GameScrnContainer from './Screens/GameScrn/GameScrnLogicQsContainer';
import GameScrnTab from './global_components/tab_navs/top/GameScrnTab';
import ResultContainer from './Screens/Results/ResultsContainer';
import ResultsScrnTab from './global_components/tab_navs/top/ResultsScrnTab';
import HomeScrnContainer from './Screens/Home/HomeScrnContainer';
import HomeScrnTab from './global_components/tab_navs/top/HomeScrnTab';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import MathOptionsScrnContainer from './Screens/MathOptionsScrn/MathOptionsScrnContainer';
import MathScrnOptionsTab from './global_components/tab_navs/top/MathScrnOptionsTab';

const Stack = createStackNavigator();
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
    },
    {
        name: "MathGameSetup",
        comp: MathScrnOptionsTab
    },
    {
        name: "BinaryScrn",
        comp: MathScrnOptionsTab
    }
] as const;

export type TTopTab = typeof navTabs[number];
export type TScreenNames = typeof navTabs[number]['name'];
export type TRootStackParamList = Record<TScreenNames[number], undefined>;
export type TStackNavigation = NavigationProp<TRootStackParamList>;
export type TStackNavigationProp = StackNavigationProp<ParamListBase, string, undefined>

const LogicGameAppNavigation = () => (
    <NavigationContainer>
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                header: props => {
                    const { comp: TopTab } = navTabs.find(({ name }) => name === props.route.name) ?? {};

                    if (!TopTab) {
                        return (
                            <View style={{ backgroundColor: "pink", height: 100 }}>

                            </View>
                        )
                    };

                    return <TopTab {...props.navigation} />;
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
            <Stack.Screen
                name="MathGameSetupScrn"
                component={MathOptionsScrnContainer}
            />
            <Stack.Screen
                name="BinaryScrn"
                component={MathOptionsScrnContainer}
            />
        </Stack.Navigator>
    </NavigationContainer>
)

export default LogicGameAppNavigation;