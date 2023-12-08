import { IAppColor, IComponentProps, TFirstColor, TSecondColor, TThirdColor } from "../../../globalTypes&Interfaces"
import { View, Animated, PanResponder, GestureResponderEvent } from 'react-native';
import { PTxt } from "../../../global_components/text";

interface ISymbol {
    width: number
    height: number
    backgroundColor: TFirstColor | TSecondColor | TThirdColor,
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

const LogicSymbol = ({
    children,
    backgroundColor = '#6B7280',
    width = 55,
    height = 55
}: Omit<IComponentProps, 'backgroundColor'> & ISymbol) => {

    // GOAL: drag the element onto the Input field. 

    // NOTES: 
    // -check if the user's drag has entered into input field when the user release their finger 
    // -when the user releases their finger, then get the coordinates
    // -when the user clicks on the symbol, have it displayed onto the input section
    // -create a top point and a bottom point of the input section
    // -check if the drag in between those points 

    return (
        <View
            style={{
                borderRadius: 10,
                backgroundColor: backgroundColor,
                width: width,
                height: height,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <PTxt
                fontSize={24}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                {children}
            </PTxt>
        </View>
    )
};

export default LogicSymbol