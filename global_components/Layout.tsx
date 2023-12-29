import { SafeAreaView, StyleSheet, View } from 'react-native';
import { IComponentProps, TLayout } from '../globalTypes&Interfaces';
import SafeAreaViewWrapper from './SafeAreaViewWrapper';

const Layout = ({
    children,
    style = { width: "100%", height: "100%" },
    backgroundColor = "#343541",
    OverlayComp,
    layoutStyle
}: IComponentProps & TLayout) => {
    const styleObj = StyleSheet.create({ main: { ...style, backgroundColor: backgroundColor } });

    return (
        <SafeAreaViewWrapper layoutStyle={layoutStyle} OverlayComp={OverlayComp}>
            <SafeAreaView style={styleObj.main}>
                {children}
            </SafeAreaView>
        </SafeAreaViewWrapper>
    );
};

export default Layout;