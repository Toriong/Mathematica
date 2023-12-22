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
    const appColors = useGetAppColors();

    return (
        <SafeAreaView
            style={{ ...style, backgroundColor: appColors.first, borderBottomColor: appColors.second }}
        >
            {children}
        </SafeAreaView>
    );
};

export default TabWrapper;