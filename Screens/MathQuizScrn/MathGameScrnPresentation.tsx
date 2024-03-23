import { Dimensions, FlatList, View } from "react-native";
import Layout from "../../global_components/Layout";
import { PTxt } from "../../global_components/text";
import { Icon } from "../../global_components/Icon";
import { faAdd, faDivide, faMinus, faMultiply, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useMathGameStore } from '../../zustand';
import { TDifficulty, TEquation, TOperator, TStrNum } from '../../zustandStoreTypes&Interfaces';
import { getIsNum } from "../../utils/generalFns";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlashList } from '@shopify/flash-list'
import { IAppColor, IComponentProps } from "../../globalTypes&Interfaces";
import Button from "../../global_components/Button";
import { useGetAppColors } from "../../custom_hooks/useGetAppColors";

type TMinAndMax = [number, number]
type TBtnTxt = typeof BTN_TXTS[number]
type TUserSelectionBtn = {
    btnTxt: TBtnTxt
    handleBtnPress: (...args: any[]) => void,
    btnBackgroundColor: Pick<IAppColor, 'second'>['second'] | '#FFC107' | 'green'
}
type IUserSelectBtn = Pick<IComponentProps, 'children'> & TUserSelectionBtn

const NUM_AND_OPERATOR_FONT_SIZE = 85
const OPERATOR_FONT_SIZE = 60
const CALCULATOR_AND_ANS_FONT_SIZE = 35
const clearAndSubmitBtnTxts = ['CLR', 'SUB'] as const
const BTN_TXTS = ['9', '8', '7', '6', '5', '4', '3', '2', '1', 'CLR', '0', 'SUB'] as const;

{/* <PTxt
    fontSize={CALCULATOR_AND_ANS_FONT_SIZE}
    txtColor='white'
    style={{ textAlign: 'center' }}
>
    {btnTxt}
</PTxt> */}

const UserSelectBtn = ({ children, btnBackgroundColor, handleBtnPress }: IUserSelectBtn) => {
    return (
        <Button
            handleOnPress={handleBtnPress}
            dynamicStyles={{
                padding: 7,
                borderRadius: 10,
                width: 90,
                marginVertical: 5,
                marginHorizontal: 5
            }}
            backgroundColor={btnBackgroundColor}
        >
            {children}
        </Button>
    )
}

const RenderUserSelectionBtn = ({ btnTxt, btnBackgroundColor, handleBtnPress }: TUserSelectionBtn) => {
    if (['CLR', 'SUB'].includes(btnTxt)) {
        return (
            <UserSelectBtn
                handleBtnPress={handleBtnPress}
                btnTxt={"9"}
                btnBackgroundColor={('CLR' === btnTxt) ? '#FFC107' : 'green'}
            >
                <PTxt>
                    {btnTxt}
                </PTxt>
            </UserSelectBtn>
        )
    }

    return (
        <Button
            handleOnPress={() => { }}
            dynamicStyles={{
                padding: 7,
                borderRadius: 10,
                width: 90,
                marginVertical: 5,
                marginHorizontal: 5
            }}
            backgroundColor={btnBackgroundColor}
        >
            <PTxt
                fontSize={CALCULATOR_AND_ANS_FONT_SIZE}
                txtColor='white'
                style={{ textAlign: 'center' }}
            >
                {btnTxt}
            </PTxt>
        </Button>
    )
}

const ArithmeticSign = ({ operator, style = {} }: { operator: Exclude<TOperator, 'none'> } & Pick<IComponentProps, 'style'>) => {
    if (operator === "*") {
        return <Icon icon={faMultiply} size={OPERATOR_FONT_SIZE} style={style} />
    }

    if (operator === "+") {
        return <Icon icon={faAdd} size={OPERATOR_FONT_SIZE} style={style} />
    }

    if (operator === '-') {
        return <Icon icon={faMinus} size={OPERATOR_FONT_SIZE} style={style} />
    }

    return <Icon icon={faDivide} size={OPERATOR_FONT_SIZE} style={style} />
}



function getTotalParseableInts(equation: TEquation) {
    return equation.filter(val => Number.isInteger(+val)).length
}

function getRandomNum(min: number, max: number) {
    const totalNumbersToChooseFrom = (max - min) + 1;
    const randomNum = Math.floor(Math.random() * totalNumbersToChooseFrom) + min;

    return randomNum;
}

function computeEquation(equation: TEquation) {
    try {
        const equationStr = equation.join('')
        const computeAns = Function(`return ${equationStr}`) as (() => number)

        return computeAns()
    } catch (error) {
        console.error('Failed to compute answer. Reason: ', error)

        return null
    }
}

function generateMathEquation(
    operator: TOperator,
    totalNumsInEquation: number,
    minAndMax: TMinAndMax,
    difficulty: TDifficulty
) {
    let equation: (TOperator | TStrNum)[] = [];

    while (totalNumsInEquation != getTotalParseableInts(equation)) {
        const lastVal = equation.at(-1)

        if ((difficulty === 'easy') && !equation.length) {
            equation.push(`${getRandomNum(1, 9)}`)
            continue
        }

        if ((difficulty === 'easy') && !getIsNum(lastVal)) {
            equation.push(`${getRandomNum(1, 99)}`)
            continue
        }

        if ((difficulty !== 'easy') && !getIsNum(lastVal)) {
            equation.push(`${getRandomNum(minAndMax[0], minAndMax[1])}`)
            continue
        }

        equation.push(operator)
    }

    return equation;
}

function getAns(equation: TEquation): number {
    const equationStr = equation.join('')
    const computeEquation = Function(`return ${equationStr}`) as (() => number)

    return computeEquation()
}

// easy: 1 - 2 digit numbers, the second number must always be a single digit number
// medium: 2 digits numbers
// hard: 3 digits
// extra hard: 4 digits
// custom: the user gets to choose

function getMinAndMax(difficulty: TDifficulty): TMinAndMax {
    // if the difficulty is easy, then for each number, it can be either 10-99 and 1-9 or both 1-0, but not both 10-99
    if (difficulty === 'med') {
        return [10, 99]
    }

    if (difficulty === 'hard') {
        return [100, 999]
    }

    return [1_000, 9_999]
}

const MathGameScrnPresentation = () => {
    const gameDiffulty = useMathGameStore(state => state.difficulty);
    const gameType = useMathGameStore(state => state.gameType) as Exclude<TOperator, 'none'>
    const numbersPerEquation = useMathGameStore(state => state.numsPerEquation)
    const { currentThemeObj } = useGetAppColors();
    const minAndMax = getMinAndMax(gameDiffulty);
    const mathEquation = generateMathEquation(gameType, numbersPerEquation, minAndMax, gameDiffulty)
    const numsInMathEquation = mathEquation.filter(mathEqVal => !Number.isNaN(+mathEqVal)).sort((numA, numB) => parseInt(numB) - parseInt(numA))
    const [userAnswer, setUserAnswer] = useState(0);
    const [btnsSecHeight, setBtnsSecHeight] = useState(0)
    const { width, height } = Dimensions.get('screen');
    const wasHeightSetRef = useRef(false);



    // if the hardest difficulty, then generate four digit numbers
    // if the medium difficulty, then generate three digit numbers
    // if easy difficulty, then generate one one to two digit numbers

    // GOAL: generate the equation

    return (
        <Layout
            style={{
                flex: 1,
                width: "100%",
                height: "100%",
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'relative',
            }}
            layoutStyle={{
                position: 'relative',
                width: '100%',
                height: '100%'
            }}
        >
            <View
                style={{
                    display: 'flex',
                    flexDirection: "column",
                    width: '100%',
                    flex: .6,
                    paddingTop: 20,
                }}
            >
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: "row",
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                                flexDirection: 'column',
                                height: '100%',
                                transform: [{ translateX: -35 }, { translateY: -8 }]
                            }}
                        >
                            <ArithmeticSign operator={gameType} />
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                                flexDirection: 'column',
                                height: '100%',
                                padding: 0,
                                margin: 0
                            }}
                        >
                            {(Array.isArray(numsInMathEquation) && (numsInMathEquation as string[])?.length) && (numsInMathEquation as string[])
                                .map((num, index) => (
                                    <PTxt
                                        key={index}
                                        fontSize={NUM_AND_OPERATOR_FONT_SIZE}
                                    >
                                        {num}
                                    </PTxt>
                                ))}
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <View
                        style={{
                            borderWidth: 10,
                            width: '80%',
                            borderColor: 'white',
                            borderRadius: 10
                        }}
                    />
                </View>
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: "row",
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                transform: [{ translateX: -35 }]
                            }}
                        >
                            <ArithmeticSign operator={gameType} style={{ opacity: 0 }} />
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                            }}
                        >
                            <PTxt fontSize={NUM_AND_OPERATOR_FONT_SIZE}>
                                {userAnswer}
                            </PTxt>
                        </View>
                    </View>
                </View>
            </View>
            <View
                style={{
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    flex: 1.4,
                    height: '100%',
                    width: '100%'
                }}
            >
                <View
                    onLayout={event => {
                        if (!wasHeightSetRef.current) {
                            const btnsSecHeight = event.nativeEvent.layout.height * .65
                            wasHeightSetRef.current = true
                            setBtnsSecHeight(btnsSecHeight)
                        }
                    }}
                    style={{
                        marginTop: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        ...((btnsSecHeight !== 0) ? { height: btnsSecHeight } : {})
                    }}
                >
                    <FlatList
                        data={BTN_TXTS}
                        numColumns={3}
                        contentContainerStyle={{
                            display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'
                        }}
                        renderItem={
                            ({ item: btnTxt, index }) => (
                                <Button
                                    handleOnPress={() => { }}
                                    dynamicStyles={{
                                        padding: 7,
                                        borderRadius: 10,
                                        width: 90,
                                        marginVertical: 5,
                                        marginHorizontal: 5
                                    }}
                                    backgroundColor={currentThemeObj.second}
                                >
                                    <PTxt
                                        fontSize={CALCULATOR_AND_ANS_FONT_SIZE}
                                        txtColor='white'
                                        style={{ textAlign: 'center' }}
                                    >
                                        {btnTxt}
                                    </PTxt>
                                </Button>
                            )
                        }
                    />
                </View>
            </View>
        </Layout>
    )
};

export default MathGameScrnPresentation;