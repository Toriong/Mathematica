import { SafeAreaView, ViewStyle } from 'react-native'
import { useGetAppColors } from '../custom_hooks/useGetAppColors';
import { IComponentProps, TFirstColor, TSecondColor } from '../globalTypes&Interfaces';

interface TStyle extends ViewStyle {
    width: "100%",
    position: 'relative',
    display: 'flex',
    borderWidth: 1
}

const TabWrapper = ({
    children,
    style = { width: '100%', position: 'relative', display: 'flex', borderWidth: 1 }
}: Pick<IComponentProps, "children"> & { style: TStyle }
) => {
    const { currentThemeObj } = useGetAppColors();

    return (
        <SafeAreaView
            style={{ ...style, backgroundColor: currentThemeObj.first, borderBottomColor: currentThemeObj.second }}
        >
            {children}
        </SafeAreaView>
    );
};

export default TabWrapper;