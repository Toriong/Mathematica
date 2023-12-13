import { View } from "react-native"
import { IComponentProps, TLayout } from "../globalTypes&Interfaces"


const SafeAreaViewWrapper = ({
    children,
    layoutStyle = { width: '100%', height: '100%' },
    OverlayComp
}: TLayout & Pick<IComponentProps, 'children'>) => {
    return (
        <View style={{ ...layoutStyle }}>
            {OverlayComp}
            {children}
        </View>
    )
};

export default SafeAreaViewWrapper;