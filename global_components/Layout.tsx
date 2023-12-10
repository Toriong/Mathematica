import { SafeAreaView, StyleSheet, View } from 'react-native';
import { IComponentProps } from '../globalTypes&Interfaces';

type TLayout = {
    layoutStyle?: Pick<IComponentProps, 'style'>['style'] & { width: '100%', height: '100%' }
    OverlayComp?: Pick<IComponentProps, 'children'>['children']
}

const Layout = ({
    children,
    OverlayComp,
    layoutStyle = { width: '100%', height: '100%' },
    style = { width: "100%", height: "100%" },
    backgroundColor = "#343541"
}: IComponentProps & TLayout) => {
    const styleObj = StyleSheet.create({ main: { ...style, backgroundColor: backgroundColor } });

    return (
        <View style={{ ...layoutStyle }}>
            {OverlayComp}
            <SafeAreaView style={styleObj.main}>
                {children}
            </SafeAreaView>
        </View>
    );
};

export default Layout;