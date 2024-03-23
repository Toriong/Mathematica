import { View } from "react-native";
import { JSX } from 'react'
import { OVERLAY_OPACITY } from "../../globalVars";

type TProp = { children?: JSX.Element | null }

const ScreenOverlay = ({ children }: TProp) => {
    return (
        <>
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'black',
                    position: 'absolute',
                    zIndex: 1,
                    opacity: OVERLAY_OPACITY,
                }}
            />
            <View
                style={{
                    zIndex: 2,
                    width: "100%",
                    height: "100%",
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {children}
            </View>
        </>
    )
};

export default ScreenOverlay;