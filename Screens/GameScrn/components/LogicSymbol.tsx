import { IAppColor, IComponentProps, TFirstColor, TSecondColor, TThirdColor } from "../../../globalTypes&Interfaces"
import { View, Animated, PanResponder, GestureResponderEvent } from 'react-native';
import { useEffect, useRef } from 'react'
import { PTxt } from "../../../global_components/text";

interface ISymbol {
    width: number
    height: number
    backgroundColor: TFirstColor | TSecondColor | TThirdColor
}

// GOAL: when the user is dragging the element and is over the input field, implement:

// GOAL #1: determine if the user is over the input field 

// GOAL #2: get what elements that the user is over 

// BRAIN DUMP NOTES: 
// get the x and y coordinates. 
// based on the x and y coordinates, determine if the user is trying to move the element in the following: 
// -in between two elements 
// -to the right of an element
// -to the lefof of an element

const LogicSymbol = ({ children, backgroundColor, width = 55, height = 55 }: Omit<IComponentProps, 'backgroundColor'> & ISymbol) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
            onPanResponderRelease: () => {
                pan.extractOffset();
            },
        }),
    ).current;

    useEffect(() => {
        // console.log("panResponder: ", panResponder)
    })

    function handleOnResponderRelase(event: GestureResponderEvent) {
        // console.log('event: ', event);
    }

    // GOAL: drag the element onto the Input field. 

    // NOTES: 
    // -check if the user's drag has entered into input field when the user release their finger 
    // -when the user releases their finger, then get the coordinates
    // -when the user clicks on the symbol, have it displayed onto the input section
    // -create a top point and a bottom point of the input section
    // -check if the drag in between those points 

    return (
        <Animated.View
            onResponderRelease={handleOnResponderRelase}
            style={{
                transform: [{ translateX: pan.x }, { translateY: pan.y }],
            }}
            {...panResponder.panHandlers}
        >
            <View style={{ borderRadius: 10, backgroundColor: backgroundColor, width: width, height: height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PTxt
                    fontSize={24}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    {children}
                </PTxt>
            </View>
        </Animated.View>
    )
};

export default LogicSymbol