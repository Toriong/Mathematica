import { FadeInUp } from "react-native-reanimated";
import { useState, useEffect, useRef } from "react";
import { IComponentProps, TTakeContainerOfOfVirtualDom } from "../../../globalTypes&Interfaces";
import FadeUpAndOut from "../../../global_components/animations/FadeUpAndOut";
import { useApiQsFetchingStatusStore } from "../../../zustand";


type TLoadingCompProps = { 
    takeContainerOfOfVirtualDom: TTakeContainerOfOfVirtualDom | null,
} 

const LoadingQs = ({ children, takeContainerOfOfVirtualDom,  }: IComponentProps & TLoadingCompProps) => {
    const [willFadeIn, setWillFadeIn] = useState(true);
    const [willFadeOut, setWillFadeOut] = useState(false);
    const didFirstRenderOccur = useRef(false);
    const gettingQsResponseStatus = useApiQsFetchingStatusStore(state => state.gettingQsResponseStatus);

    useEffect(() => {
        if(!willFadeOut && (gettingQsResponseStatus === "FAILURE" || gettingQsResponseStatus === "SUCCESS" || gettingQsResponseStatus === "NOT_EXECUTING")){
            setWillFadeOut(true);
        }
    }, [gettingQsResponseStatus])

    useEffect(() => {
        return () => {
            if(didFirstRenderOccur.current){
                setWillFadeIn(false)
            };

            didFirstRenderOccur.current = true;
        }
    }, [])



    return (
        <FadeUpAndOut
            _willFadeIn={[willFadeIn, setWillFadeIn]}
            takeContainerOffOfVirutalDom={takeContainerOfOfVirtualDom}
            willFadeOut={willFadeOut}
        >
            {children}
        </FadeUpAndOut>
    )
};

export default LoadingQs;