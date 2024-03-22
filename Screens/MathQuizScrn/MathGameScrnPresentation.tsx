import { GestureResponderEvent, View } from "react-native";
import Layout from "../../global_components/Layout";
import Button from "../../global_components/Button";
import { PTxt } from "../../global_components/text";
import { Icon } from "../../global_components/Icon";
import { faDivide, faMultiply, faPlus, faSubtract } from "@fortawesome/free-solid-svg-icons";
import { useColorStore, useMathGameStore } from '../../zustand';
import { useGetAppColors } from "../../custom_hooks/useGetAppColors";
import { TDifficulty, TOperator } from '../../zustandStoreTypes&Interfaces';
import { getIsNum } from "../../utils/generalFns";

type TStrNum = `${number}`
type TOperatorForMathScn = Omit<TOperator, "none">
type TEquation = (TStrNum | TOperatorForMathScn)[]

function getTotalParseableInts(equation: TEquation) {
    return equation.filter(val => Number.isInteger(+val)).length
}

function getRandomNum(min: number, max: number) {
    const totalNumbersToChooseFrom = (max - min) + 1;
    // add the min, handle the case which the number is below the 
    // min
    const randomNum = Math.floor(Math.random() * totalNumbersToChooseFrom) + min;

    return randomNum + min;
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
    minAndMax: { min: number, max: number }
) {
    let equation: (TOperator | TStrNum)[] = [];

    while (totalNumsInEquation != getTotalParseableInts(equation)) {
        const lastVal = equation.at(-1)

        if (!getIsNum(lastVal)) {
            equation.push(`${getRandomNum(minAndMax.min, minAndMax.max)}`)
            continue
        }

        equation.push(operator)
    }

    return equation;
}

function getAnswer(equation: TEquation): number {
    const equationStr = equation.join('')
    const computeAns = Function(`return ${equationStr}`) as (() => number)

    return computeAns()
}

// easy: 1 - 2 digit numbers
// medium: 2 digits numbers
// hard: 3 - 4 digits
// custom: the user gets to choose

function getNumRange() {

}

const MathGameScrnPresentation = () => {
    const gameDiffulty = useMathGameStore(state => state.difficulty);
    const gameType = useMathGameStore(state => state.gameType)
    const numbersPerEquation = useMathGameStore(state => state.numsPerEquation)
    const mathEquation = generateMathEquation(gameType, numbersPerEquation,)
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
            <View>

            </View>
        </Layout>
    )
};

export default MathGameScrnPresentation;