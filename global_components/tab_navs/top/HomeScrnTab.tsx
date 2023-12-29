import { TStackNavigationProp } from "../../../Navigation";
import TabWrapper from "../../TabWrapper";
import { PTxt } from "../../text";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

// { navigation }: NativeStackHeaderProps

const HomeScrnTab = ({ navigate }: TStackNavigationProp) => {

    return (
        <TabWrapper style={{ width: '100%', position: 'relative', display: 'flex', borderWidth: 1, height: 150 }}>
            <PTxt>Home</PTxt>
        </TabWrapper>
    )
};

export default HomeScrnTab;