import { IComponentProps } from "../globalTypes&Interfaces";
import { useEffect, useRef, useState } from 'react';
import { Animated, View, PanResponder, GestureResponderEvent } from 'react-native';


const Draggable = ({ children }: Pick<IComponentProps, 'children'>) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [
                    null,
                    { dx: pan.x, dy: pan.y }
                ],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: event => {
                console.log("released event: ", event.nativeEvent.locationX)
                pan.extractOffset();
            },
        }),
    ).current;

    useEffect(() => {
        console.log('on first render pan yo there: ', pan)
    })

    // NOTES: 
    // CASE: the user releases the first tile in between two tiles.
    // GOAL: put the released tile in between the two tiles.

    // get the coordinates of the first tile
    // get the coordinates 

    function handleOnResponderRelease(event: GestureResponderEvent) {
        console.log("event object: ", event);
    };

    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 })

    return (
        <Animated.View
            
            onLayout={event => {
                console.log('event yo there: ', event.nativeEvent.layout.x);
                // setCoordinates({ x: event.nativeEvent.layout.,  })
            }}
            onResponderRelease={handleOnResponderRelease}
            style={{
                transform: [{ translateX: pan.x }, { translateY: pan.y }],
                position: 'relative',
            }}
            {...panResponder.panHandlers}
        >
            {children}
        </Animated.View>
    )
};

export default Draggable;