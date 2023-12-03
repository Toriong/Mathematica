import { SafeAreaView, StyleSheet } from 'react-native';
import { IComponentProps } from '../globalTypes&Interfaces';

const Layout = ({ children, style = { width: "100%", height: "100%" }, backgroundColor = "#343541" }: IComponentProps) => {
    const styleObj = StyleSheet.create({ main: { ...style, backgroundColor: backgroundColor } });

    return (
        <SafeAreaView style={styleObj.main}>
            {children}
        </SafeAreaView>
    );
};

export default Layout;