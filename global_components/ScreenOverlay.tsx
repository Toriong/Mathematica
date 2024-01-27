import { View } from "react-native";
import { PTxt } from "./text";
import { IComponentProps } from "../globalTypes&Interfaces";
import { OVERLAY_OPACITY } from "../globalVars";

type TProps = {
    isAnswerCorrect: boolean
} & Pick<IComponentProps, "children">

const ScreenOverlay = ({ children, isAnswerCorrect }: TProps) => {
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
                <PTxt
                    fontSize={30}
                    txtColor={isAnswerCorrect ? 'green' : 'red'}
                >
                    {isAnswerCorrect ? "CORRECT!" : "WRONG."}
                </PTxt>
                <PTxt fontSize={200}>
                    {isAnswerCorrect
                        ?
                        "✅"
                        :
                        "❌"
                    }
                </PTxt>
                <PTxt
                    fontSize={30}
                    txtColor={isAnswerCorrect ? "green" : "red"}
                >
                    Correct Answer:
                </PTxt>
                <View
                    style={{
                        display: 'flex',
                        marginTop: 10,
                        flexDirection: 'row',
                        gap: 6,
                        width: "100%",
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {children}
                </View>
            </View>
        </>
    )
};

export default ScreenOverlay;