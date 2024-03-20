import { useState } from "react";
import { TStackNavigationProp } from "../../../Navigation";
import TabWrapper from "../../TabWrapper";
import { Switch, View } from 'react-native'
import { HeadingTxt } from "../../text";
import { Icon } from "../../Icon";
import { faUser } from "@fortawesome/free-solid-svg-icons";


const HomeScrnTab = ({ navigate }: TStackNavigationProp) => {
    const [isOnDarkMode, setIsOnDarkMode] = useState(false)

    function handleSwitchToggle() {
        setIsOnDarkMode(isOnDarkMode => !isOnDarkMode)
    }

    return (
        <TabWrapper style={{
            flexDirection: 'row',
            width: '100%',
            position: 'relative',
            display: 'flex',
            height: 150
        }}>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                }}
            >
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isOnDarkMode ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={handleSwitchToggle}
                    value={isOnDarkMode}
                />
            </View>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    flex: 2,
                }}
            >
                <HeadingTxt fontSize={28} style={{ width: '100%', fontStyle: 'italic', textAlign: 'center' }}>
                    Mathematica
                </HeadingTxt>
            </View>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}
            >
                <Icon icon={faUser} color='#4267B2' size={30} />
            </View>
        </TabWrapper>
    )
};

export default HomeScrnTab;