import { View } from "react-native"
import { PTxt } from "../../../global_components/text"

interface IProps {
    isAnswerCorrect: boolean
    correctAnswer: string
    userAnswer: string
}

const Answer = ({
    isAnswerCorrect,
    correctAnswer,
    userAnswer
}: IProps) => {
    return (
        <>
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
                <PTxt
                    fontSize={30}
                    txtColor={isAnswerCorrect ? "green" : "red"}
                >
                    {correctAnswer}
                </PTxt>
            </View>
            <PTxt
                fontSize={30}
                txtColor={isAnswerCorrect ? "green" : "red"}
            >
                Your Answer:
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
                <PTxt
                    fontSize={30}
                    txtColor={isAnswerCorrect ? "green" : "red"}
                >
                    {userAnswer}
                </PTxt>
            </View>
        </>
    )
};

export default Answer