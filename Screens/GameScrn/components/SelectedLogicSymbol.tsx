import { IComponentProps } from "../../../globalTypes&Interfaces";
import Draggable from "../../../global_components/Draggable"
import { View, TouchableOpacity, GestureResponderEvent } from 'react-native';
import LogicSymbol from "./LogicSymbol";
import Button from "../../../global_components/Button";

// NOTES: 
// the user drags the element to the left
// the user releases the element in between two elements
// on the release, get the following: 
// -the x coordinate of the element 
// -the y coordinate of the element
// -get the coordinates of the other elements
// -get the first nearest elements based on the above coordinates
// -there are two elements
// -the user moved the element from the left

const SelectedLogicSymbol = ({ children }: IComponentProps) => {

    function handleBtnPress(event: GestureResponderEvent) {

    }

    return (
        <Button backgroundColor='none' handleOnPress={handleBtnPress}>
            <LogicSymbol
                backgroundColor="#6B7280"
                width={55}
                height={55}
            >
                {children}
            </LogicSymbol>
        </Button>
    )
};

export default SelectedLogicSymbol;