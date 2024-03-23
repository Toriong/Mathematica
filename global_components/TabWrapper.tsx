import { SafeAreaView, ViewStyle } from 'react-native'
import { useGetAppColors } from '../custom_hooks/useGetAppColors';
import { IComponentProps, TFirstColor, TSecondColor } from '../globalTypes&Interfaces';
import { JSX } from 'react';

interface TStyle extends ViewStyle {
    width: "100%",
    position: 'relative',
    display: 'flex',
    borderWidth?: number
}
type IProps = Pick<IComponentProps, "children"> & { style: TStyle; Overlay?: JSX.Element | null }

const TabWrapper = ({
    children,
    Overlay,
    style = { width: '100%', position: 'relative', display: 'flex', borderWidth: 1 }
}: IProps
) => {
    const { currentThemeObj } = useGetAppColors();

    return (
        <>
            {Overlay}
            <SafeAreaView
                style={{ ...style, backgroundColor: currentThemeObj.first, borderBottomColor: currentThemeObj.second }}
            >
                {children}
            </SafeAreaView>
        </>
    );
};

export default TabWrapper;