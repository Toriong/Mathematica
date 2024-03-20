import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../global_components/Layout';
import { View, TouchableOpacity, TextStyle, Alert } from 'react-native';
import { PTxt } from '../../global_components/text';
import { useApiQsFetchingStatusStore, useGameScrnTabStore, useQuestionsStore } from '../../zustand';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faArrowRight, faCancel } from "@fortawesome/free-solid-svg-icons";
import { LETTERS, OVERLAY_OPACITY, SYMBOLS, structuredClone } from '../../globalVars';
import Button from '../../global_components/Button';
import uuid from 'react-native-uuid';
import LogicSymbol from './components/LogicSymbol';
import EditSelectedSymbolBtn from './components/EditSelectedSymbolBtn';
import LoadingQsModal from './components/LoadingQsModal';
import { useGetAppColors } from '../../custom_hooks/useGetAppColors';
import { useNavigation } from '@react-navigation/native';
import { TStackNavigation } from '../../Navigation';
import { IQuestionOnClient } from '../../zustandStoreTypes&Interfaces';
import { TStateSetter, TUseStateReturnVal } from '../../globalTypes&Interfaces';
import { getIsAnswerCorrect } from './functions/getIsAnswerCorrect';
import { getHasUserReachedQuizGenerationLimit } from '../../api_services/users/getHasUserReachedQuizGenerationLimit';
import { getUserId } from '../../utils/generalFns';
import { CustomError } from '../../utils/errors';
import { useGetCanUserGetAGeneratedQuiz } from '../../custom_hooks/useGetCanUserGenerateAQuiz';

type TSelectedSymbol = typeof SYMBOLS[number] | typeof LETTERS[number]
interface ISelectedLogicSymbol {
  symbol: TSelectedSymbol
  _id?: ReturnType<typeof uuid.v4>
  wasPressed?: boolean
}
interface TGameScrnLogicQsPresentationProps {
  _wasSkipBtnPressed: [boolean, TStateSetter<boolean>]
  _getMoreQsNum: [null | number, TStateSetter<null | number>]
  _isUserOnLastQ: TUseStateReturnVal<boolean>
  setWillIncrementQIndex: TStateSetter<boolean>
}

const TXT_FONT_SIZE = 20;
const SYMBOL_WIDTH_AND_HEIGHT = 45;

function getCorrectAnswerArrForUI(answerArrSymbols: string[]) {
  let answerArrClone = structuredClone<string[]>(answerArrSymbols);
  let answerArrUpdated: string[] = [];

  for (let index = 0; index < answerArrClone.length; ++index) {
    const currentAnswerSymbol = answerArrClone[index];
    const nextAnswerSymbol = answerArrClone[index + 1];

    if ((currentAnswerSymbol !== "~") || !nextAnswerSymbol) {
      answerArrUpdated.push(currentAnswerSymbol);
      continue
    }

    // putting the negation symbol and the next symbol into one string
    let newAnswerSymbol = `${currentAnswerSymbol}${nextAnswerSymbol}`;
    answerArrClone.splice(index + 1, 1);
    answerArrUpdated.push(newAnswerSymbol);
  };

  return answerArrUpdated;
}

function getDeleteAndMoveSelectedSymbolBtns(
  handleMovementButtonPress: (num: 1 | -1) => void,
  handleDeleteSymbolButtonPress: () => void,
  opacity: 1 | .1,
) {
  const areBtnsDisabled = opacity === .1;

  return [
    <EditSelectedSymbolBtn
      isDisabled={areBtnsDisabled}
      dynamicStyles={{ opacity: opacity }}
      backgroundColor="transparent"
      Icon={<FontAwesomeIcon
        size={25}
        icon={faArrowLeft} />}
      handleOnPress={() => { handleMovementButtonPress(-1) }}
    />,
    <EditSelectedSymbolBtn
      isDisabled={areBtnsDisabled}
      dynamicStyles={{ opacity: opacity }}
      backgroundColor="transparent"
      Icon={<FontAwesomeIcon
        size={25}
        color='red'
        icon={faCancel} />}
      handleOnPress={handleDeleteSymbolButtonPress}
    />,
    <EditSelectedSymbolBtn
      isDisabled={areBtnsDisabled}
      dynamicStyles={{ opacity: opacity }}
      backgroundColor="transparent"
      Icon={<FontAwesomeIcon size={25} icon={faArrowRight} />}
      handleOnPress={() => { handleMovementButtonPress(1) }}
    />,
  ]
};

function getUpdatedSelectedSymbolsArr(indexToSwitchSelectedSymbolWith: number, selectedSymbolIndex: number, selectedSymbols: ISelectedLogicSymbol[]) {
  let selectedLogicSymbolsClone = structuredClone<ISelectedLogicSymbol[]>(selectedSymbols);
  let selectedSymbol = structuredClone<ISelectedLogicSymbol>(selectedLogicSymbolsClone[selectedSymbolIndex]);
  let symbolToSwitchWithSelectedSymbol = structuredClone<ISelectedLogicSymbol>(selectedLogicSymbolsClone[indexToSwitchSelectedSymbolWith]);
  selectedLogicSymbolsClone[indexToSwitchSelectedSymbolWith] = selectedSymbol;
  selectedLogicSymbolsClone[selectedSymbolIndex] = symbolToSwitchWithSelectedSymbol;

  return selectedLogicSymbolsClone;
}

const GameScrnPresentation = ({
  _wasSkipBtnPressed,
  _getMoreQsNum,
  setWillIncrementQIndex,
  _isUserOnLastQ
}: TGameScrnLogicQsPresentationProps) => {
  const navigation = useNavigation<TStackNavigation>();
  const questions = useQuestionsStore(state => state.questions);
  const gameScrnMode = useGameScrnTabStore(state => state.mode);
  const isOnReviewMode = gameScrnMode === "review";
  const questionsToReview = gameScrnMode === "review" ? questions.filter(question => question.userAnswer) : [];
  const questionsLength = (gameScrnMode === "review") ? questionsToReview.length : 0
  const { currentThemeObj } = useGetAppColors();
  const wasSubmitBtnPressed = useGameScrnTabStore(state => state.wasSubmitBtnPressed);
  const rightNum = useGameScrnTabStore(state => state.right);
  const wrongNum = useGameScrnTabStore(state => state.wrong);
  const questionIndex = useQuestionsStore(state => state.questionIndex);
  const updateQuestionsStore = useQuestionsStore(state => state.updateState);
  const setGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
  const updateApiQsFetchingStatusStore = useApiQsFetchingStatusStore(state => state.updateState);
  const pointOfFailureInGettingNextQ = useApiQsFetchingStatusStore(state => state.pointOfFailure);
  const [correctAnswerArr, setCorrectAnswerArr] = useState<string[]>([]);
  const [selectedLogicSymbols, setSelectedLogicSymbols] = useState<ISelectedLogicSymbol[]>([]);
  const [wasSkipBtnPressed, setWasSkipBtnPressed] = _wasSkipBtnPressed;
  const [getMoreQsNum, setGetMoreQsNum] = _getMoreQsNum;
  const [, setIsUserOnLastQ] = _isUserOnLastQ;

  const question = questions?.length ? (isOnReviewMode ? questionsToReview : questions)[questionIndex] : null;
  const { choices, answer, symbolOptions: symbolOptionsFromServer, userAnswer } = question ?? {};
  let isAnswerCorrect: boolean = false;
  let isAnswerCorrectOnReviewMode: boolean | null = null;
  const symbolOptions = useMemo(() => [...SYMBOLS, ...(Array.isArray(symbolOptionsFromServer) ? symbolOptionsFromServer : [])].map(symbol => ({
    symbol: symbol,
    wasPressed: false
  })), [questions, questionIndex]);
  const reviewModeCorrectAnswerArr = useMemo(() => {
    if (isOnReviewMode && answer) {
      return getCorrectAnswerArrForUI(answer)
    };

    return [];
  }, [questionIndex]);

  if (isOnReviewMode) {
    const userAnswerArrAfterEmptyCheck = userAnswer?.length ? userAnswer : [];
    isAnswerCorrectOnReviewMode = !userAnswerArrAfterEmptyCheck?.length ? false : getIsAnswerCorrect(userAnswerArrAfterEmptyCheck, answer as string[]);
  }

  if (wasSubmitBtnPressed) {
    // isAnswerCorrect = JSON.stringify(answer) === JSON.stringify(selectedLogicSymbols.map(({ symbol }) => symbol));
    isAnswerCorrect = getIsAnswerCorrect(selectedLogicSymbols.map(({ symbol }) => symbol), answer as string[])
  };

  function handleSymbolOptPress(selectedLogicSymbol: ISelectedLogicSymbol) {
    const selectedSymbolPressed = selectedLogicSymbols.find(({ wasPressed }) => wasPressed);

    setSelectedLogicSymbols(selectedLogicSymbols => {
      const newSelectedSymbol = { symbol: selectedLogicSymbol.symbol, _id: uuid.v4() };

      if (selectedSymbolPressed) {
        return selectedLogicSymbols.map(logicSymbol => {
          if (logicSymbol._id === selectedSymbolPressed._id) {
            return newSelectedSymbol;
          };

          return logicSymbol;
        });
      }

      return [...selectedLogicSymbols, newSelectedSymbol]
    });
  };

  async function handleSkipBtnPress() {
    const questionsUpdated = questions.map((question, index) => {
      if (index === questionIndex) {
        return {
          ...question,
          wasSkipped: true
        }
      };

      return question;
    });

    updateQuestionsStore(questionsUpdated, "questions");
    setSelectedLogicSymbols([]);

    if (!questions[questionIndex + 1]) {
      updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus");
      setWillIncrementQIndex(true);
      setIsUserOnLastQ(true);
      setWasSkipBtnPressed(true);
      return;
    };

    updateQuestionsStore(questionIndex + 1, "questionIndex");
  }

  function handleMovementSymbolBtnPress(numToIncreaseSelectedIndexBy: -1 | 1) {
    try {
      const selectedSymbolIndex = selectedLogicSymbols.findIndex(({ wasPressed }) => wasPressed);
      let indexToSwitchSelectedSymbolWith: number | null = (selectedSymbolIndex === -1) ? null : (selectedSymbolIndex + (numToIncreaseSelectedIndexBy));

      if (selectedSymbolIndex === -1) {
        throw new Error("Failed to retrieve the selected symbol by the user.")
      };

      let updatedSelectedSymbolsArr = structuredClone<ISelectedLogicSymbol[]>(selectedLogicSymbols);

      if ((selectedSymbolIndex === (selectedLogicSymbols.length - 1)) && (Math.sign(numToIncreaseSelectedIndexBy) === 1)) {
        const selectedSymbol = updatedSelectedSymbolsArr[selectedSymbolIndex];
        updatedSelectedSymbolsArr.splice(selectedSymbolIndex, 1);
        updatedSelectedSymbolsArr.unshift(selectedSymbol);
      } else if ((selectedSymbolIndex === 0) && (Math.sign(numToIncreaseSelectedIndexBy) === -1)) {
        const selectedSymbol = updatedSelectedSymbolsArr[0];
        updatedSelectedSymbolsArr.splice(0, 1);
        updatedSelectedSymbolsArr.push(selectedSymbol);
      } else {
        updatedSelectedSymbolsArr = getUpdatedSelectedSymbolsArr(
          indexToSwitchSelectedSymbolWith as number,
          selectedSymbolIndex,
          selectedLogicSymbols
        );
      }
      setSelectedLogicSymbols(updatedSelectedSymbolsArr);
    } catch (error) {
      console.error("An error has occurred in moving the selected symbol: ", error);
    }
  }

  function handleDeleteSelectedSymbolBtnPress() {
    setSelectedLogicSymbols(selectedLogicSymbols => selectedLogicSymbols.filter(({ wasPressed }) => !wasPressed));
  };

  function handleToResultScrnBtnPress() {
    navigation.navigate("ResultsScreen")
  }

  function handleReviewQNavBtn(num: 1 | -1) {
    return () => {
      let questionIndexUpdated = questionIndex + num;

      if ((questionIndex === 0) && (num === -1)) {
        questionIndexUpdated = questions.length - 1
      };

      if ((questionIndex === (questions.length - 1)) && (num === 1)) {
        questionIndexUpdated = 0;
      }

      updateQuestionsStore(questionIndexUpdated, "questionIndex")
    }
  }

  const pressedSelectedSymbol = selectedLogicSymbols ? selectedLogicSymbols.find(({ wasPressed }) => wasPressed) : null;
  const directionAndDeleteButtons = useMemo(() => getDeleteAndMoveSelectedSymbolBtns(handleMovementSymbolBtnPress, handleDeleteSelectedSymbolBtnPress, pressedSelectedSymbol ? 1 : .1), [pressedSelectedSymbol]);

  function handleSelectedLogicSymbol(selectedLogicSymbol: ISelectedLogicSymbol) {
    try {
      const targetSymbol = selectedLogicSymbols.find(({ _id }) => _id === selectedLogicSymbol._id);

      if (!targetSymbol) {
        throw new Error("Something went wrong couldn't retrieve the target symbol.")
      };

      const previouslyPressedSelectedSymbolIndex = selectedLogicSymbols.findIndex(({ wasPressed, _id }) => wasPressed && (selectedLogicSymbol._id !== _id));
      const currentlyPressedSelectedSymbolIndex = selectedLogicSymbols.findIndex(symbol => symbol._id === selectedLogicSymbol._id);

      // switch the symbols with one another
      if ((currentlyPressedSelectedSymbolIndex !== -1) && (previouslyPressedSelectedSymbolIndex !== -1)) {
        let selectedLogicSymbolsClone = structuredClone<ISelectedLogicSymbol[]>(selectedLogicSymbols);
        let previouslyPressedSelectedSymbol = structuredClone<ISelectedLogicSymbol>(selectedLogicSymbolsClone[previouslyPressedSelectedSymbolIndex]);
        let currentlyPressedSelectedSymbol = structuredClone<ISelectedLogicSymbol>(selectedLogicSymbolsClone[currentlyPressedSelectedSymbolIndex]);
        selectedLogicSymbolsClone[previouslyPressedSelectedSymbolIndex] = currentlyPressedSelectedSymbol;
        selectedLogicSymbolsClone[currentlyPressedSelectedSymbolIndex] = previouslyPressedSelectedSymbol;
        previouslyPressedSelectedSymbol.wasPressed = false;
        currentlyPressedSelectedSymbol.wasPressed = false;
        setSelectedLogicSymbols(selectedLogicSymbolsClone);
        return;
      }

      if (!targetSymbol?.wasPressed && (previouslyPressedSelectedSymbolIndex === -1)) {
        setSelectedLogicSymbols(symbols => symbols.map(symbol => {
          if (symbol._id === selectedLogicSymbol._id) {
            return {
              ...symbol,
              wasPressed: true
            }
          }

          return symbol
        }));
        return;
      };

      setSelectedLogicSymbols(symbols => symbols.map(symbol => {
        if (symbol._id === selectedLogicSymbol._id) {
          return {
            ...symbol,
            wasPressed: false
          }
        }

        return symbol
      }));
    } catch (error) {
      console.error("An error has occurred: ", error)
    }
  }

  function handleClearBtnPress() {
    setSelectedLogicSymbols([]);
  };

  function handleSubmitBtnPress() {
    setGameScrnTabStore(true, 'wasSubmitBtnPressed');
    setGameScrnTabStore(false, 'isTimerOn');
    let answerArrClone = structuredClone<string[]>(answer);
    let correctAnswerArr: string[] = [];
    const currentQuestionUpdated = {
      ...questions[questionIndex],
      userAnswer: selectedLogicSymbols.map(selectedLogicSymbol => selectedLogicSymbol.symbol)
    } satisfies IQuestionOnClient;
    const questionsUpdated = questions.map((question, index) => {
      if (questionIndex === index) return currentQuestionUpdated

      return question;
    });
    const isAnswerCorrect = JSON.stringify(answer) === JSON.stringify(selectedLogicSymbols.map(({ symbol }) => symbol))

    updateQuestionsStore(questionsUpdated, "questions");

    // the values in correctAnswerArr will be displayed onto the ui by using the 'correctAnswerArr' state
    for (let index = 0; index < answerArrClone.length; ++index) {
      const currentAnswerSymbol = answerArrClone[index];
      const nextAnswerSymbol = answerArrClone[index + 1];

      if ((currentAnswerSymbol !== "~") || !nextAnswerSymbol) {
        correctAnswerArr.push(currentAnswerSymbol);
        continue
      }

      // putting the negation symbol and the next symbol into one string
      let newAnswerSymbol = `${currentAnswerSymbol}${nextAnswerSymbol}`;
      answerArrClone.splice(index + 1, 1);
      correctAnswerArr.push(newAnswerSymbol);
    }

    setCorrectAnswerArr(correctAnswerArr);

    if (questions[questionIndex + 1]) {
      setTimeout(() => {
        setSelectedLogicSymbols([]);

        updateQuestionsStore(questionIndex + 1, "questionIndex");

        setGameScrnTabStore(true, 'isTimerOn');

        setGameScrnTabStore(false, 'wasSubmitBtnPressed');
      }, 2000);
    } else {
      console.log("The user is on the last question, will get next question for the questions array...");

      updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus");

      // GOAL: for the logic that gets the question from the backend in the container component, once the question is received
      // have the following occur (if successful)
      // -start the timer
      // -set wasSubmitBtnPressed to false
      setIsUserOnLastQ(true);
      setWillIncrementQIndex(true);
      setTimeout(() => {
        setSelectedLogicSymbols([]);
      }, 300)
    }

    if (isAnswerCorrect) {
      setGameScrnTabStore(rightNum + 1, "right");
      return;
    }

    setGameScrnTabStore(wrongNum + 1, "wrong")
  };

  async function handleGetQuestionsBtnPress(toggleDisableGetQuestionsBtn: () => void) {
    const userId = await getUserId();

    toggleDisableGetQuestionsBtn();

    getHasUserReachedQuizGenerationLimit(userId as string)
      .then(result => {
        if (!result.wasSuccessful) {
          Alert.alert("Something went wrong. Couldn't generate a quiz. Please try again later.");
          throw new CustomError("The response from the server was unsuccessful.", 400);
        }

        if (result.hasReachedLimit) {
          Alert.alert("You have reached your limit of gnerated quizzes within a 24 hour period. Please try again later.")
          throw new CustomError("The user has reached their daily limit of quizzes generated.", 429);
        }

        updateApiQsFetchingStatusStore("IN_PROGRESS", "gettingQsResponseStatus")

        if (pointOfFailureInGettingNextQ === "submitBtnPress") {
          setWillIncrementQIndex(true);
          setIsUserOnLastQ(true);
          setWasSkipBtnPressed(true);
          return;
        }

        updateApiQsFetchingStatusStore(true, "willGetQs");
      })
      .catch(error => {
        console.error("An error has occurred in checking if the user has reached their limit of quiz generated within a 24 hour span. Error object: ", error);
      })
      .finally(() => {
        toggleDisableGetQuestionsBtn();
      })
  }

  useEffect(() => {
    if (gameScrnMode === "finished") {
      setSelectedLogicSymbols([]);
    }
  }, [gameScrnMode]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setGameScrnTabStore(false, "wasSubmitBtnPressed")
    });

    navigation.addListener('beforeRemove', () => {
      if (wasSubmitBtnPressed) {
        setGameScrnTabStore(false, "wasSubmitBtnPressed")
      }
    })
  }, [])

  useEffect(() => {
    if ((gameScrnMode === "quiz") && (questionIndex === questions.length)) {
      setGetMoreQsNum(3);
    }
  }, [questionIndex]);

  return (
    <>
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
        OverlayComp={
          wasSubmitBtnPressed && (
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
                  {correctAnswerArr.map((symbol, index) => (
                    <PTxt
                      key={index}
                      fontSize={30}
                      txtColor={isAnswerCorrect ? "green" : "red"}
                    >
                      {symbol}
                    </PTxt>
                  ))}
                </View>
              </View>
            </>
          )
        }
      >
        <View style={{ flex: 1, width: "100%", display: 'flex', paddingTop: 7, justifyContent: 'center', alignItems: 'center' }}>
          <PTxt
            fontSize={TXT_FONT_SIZE}
            style={{ textAlign: 'center', paddingHorizontal: 7 }}
            fontStyle='italic'
          >
            {question?.sentence}
          </PTxt>
        </View>
        {choices?.length && (
          <View style={{ flex: .8, width: "100%", alignItems: 'center', display: 'flex', justifyContent: 'center', paddingHorizontal: 18 }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 5, width: "70%" }}>
              {choices.map((choice, index, self) => (
                <View key={index} style={{ display: 'flex', flexDirection: 'row', }}>
                  <PTxt fontSize={TXT_FONT_SIZE}>{choice.letter} = </PTxt>
                  <PTxt fontSize={TXT_FONT_SIZE} >{choice.value}{(index !== (self.length - 1)) ? ',' : ''}</PTxt>
                </View>
              ))
              }
            </View>
          </View>
        )}
        <View
          style={{
            flex: 1.3,
            width: "100%",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <View
            style={{
              width: "93%",
              height: 70,
              display: 'flex',
              flexDirection: isOnReviewMode ? 'column' : 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 5,
              borderBottomWidth: 1,
              borderBottomColor: currentThemeObj.second,
              position: 'relative',
            }}
          >
            {isOnReviewMode && (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%"
                }}
              >
                <PTxt
                  fontSize={TXT_FONT_SIZE}
                  txtColor={isAnswerCorrectOnReviewMode ? "green" : "red"}
                >
                  Your Answer:
                </PTxt>
              </View>
            )
            }
            {isOnReviewMode ?
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  gap: 3
                }}
              >
                {userAnswer?.length ?
                  userAnswer.map((symbol, index) => {
                    return (
                      <LogicSymbol
                        key={index}
                        width="auto"
                        height={50}
                        txtFontSize={30}
                        backgroundColor="transparent"
                        pTxtColor={isAnswerCorrectOnReviewMode ? "green" : "red"}
                      // pTxtStyle={(symbol === "∃") ? { transform: [{ rotateY: "180deg" }] } : {}}
                      >
                        {symbol}
                      </LogicSymbol>
                    )
                  })
                  :
                  <PTxt
                    fontSize={TXT_FONT_SIZE}
                    txtColor="red"
                  >
                    None Provided.
                  </PTxt>
                }
              </View>
              :
              (!!selectedLogicSymbols.length && !isOnReviewMode) && selectedLogicSymbols.map(symbol => {
                const _id = uuid.v4().toString();

                return (
                  <TouchableOpacity
                    id={_id}
                    key={_id}
                    onPress={() => handleSelectedLogicSymbol(symbol)}
                    style={{ opacity: symbol.wasPressed ? .4 : 1 }}
                  >
                    <LogicSymbol
                      width="auto"
                      height={50}
                      txtFontSize={30}
                      backgroundColor="transparent"
                      pTxtStyle={(symbol.symbol === "∃") ? { transform: [{ rotateY: "180deg" }] } : {}}
                    >
                      {(symbol.symbol === '∃') ? "E" : symbol.symbol}
                    </LogicSymbol>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: "100%",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {!isOnReviewMode && (
            <View style={{
              display: "flex",
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: currentThemeObj.second,
              width: "93%",
              gap: 8,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 8
            }}>
              {directionAndDeleteButtons.map((Button, index) => (
                <View
                  key={index}
                  style={{
                    width: SYMBOL_WIDTH_AND_HEIGHT,
                    height: SYMBOL_WIDTH_AND_HEIGHT,
                    backgroundColor: currentThemeObj.second,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                  }}>
                  {Button}
                </View>
              ))}
            </View>
          )}
          {isOnReviewMode && (
            <View
              style={{
                display: 'flex',
                width: "80%",
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PTxt
                fontSize={TXT_FONT_SIZE}
                txtColor="green"
              >
                Correct Answer:
              </PTxt>
            </View>
          )}
          <View
            style={{
              display: 'flex',
              width: "80%",
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 8
            }}
          >
            {isOnReviewMode ?
              <>
                {reviewModeCorrectAnswerArr.map((symbol, index) => {
                  let _pTxtStyle = {};

                  return (
                    <LogicSymbol
                      key={index}
                      width={isOnReviewMode ? "auto" : SYMBOL_WIDTH_AND_HEIGHT}
                      height={isOnReviewMode ? "auto" : SYMBOL_WIDTH_AND_HEIGHT}
                      backgroundColor="transparent"
                      txtFontSize={30}
                      pTxtStyle={_pTxtStyle}
                      pTxtColor="green"
                    >
                      {symbol}
                    </LogicSymbol>
                  )
                })}
              </>
              :
              symbolOptions.map((symbolOpt, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSymbolOptPress(symbolOpt)}
                >
                  <LogicSymbol
                    width={SYMBOL_WIDTH_AND_HEIGHT}
                    height={SYMBOL_WIDTH_AND_HEIGHT}
                    backgroundColor={currentThemeObj.second}
                    txtFontSize={24}
                  >
                    {symbolOpt.symbol}
                  </LogicSymbol>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: "100%",
            marginTop: "5%",
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: "center",
            justifyContent: 'center'
          }}>
          {isOnReviewMode ?
            <View
              style={{
                flexDirection: "column"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                  transform: [{ translateY: -10 }]
                }}
              >
                <Button
                  isDisabled={questionIndex === 0}
                  handleOnPress={handleReviewQNavBtn(-1)}
                  backgroundColor={currentThemeObj.second}
                  dynamicStyles={{
                    padding: 14,
                    borderRadius: 15,
                    opacity: (questionIndex === 0) ? .4 : 1
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
                <Button
                  isDisabled={questionIndex === (questionsToReview.length - 1)}
                  handleOnPress={handleReviewQNavBtn(1)}
                  backgroundColor={currentThemeObj.second}
                  dynamicStyles={{
                    padding: 14,
                    borderRadius: 15,
                    opacity: (questionIndex === (questionsToReview.length - 1)) ? .4 : 1
                  }}

                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </View>
              {isOnReviewMode && (
                <View style={{ marginBottom: 8, justifyContent: "center", alignItems: "center" }}>
                  <PTxt
                    fontSize={TXT_FONT_SIZE}
                  >
                    {questionIndex + 1}/{questionsLength}
                  </PTxt>
                </View>
              )}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Button
                  handleOnPress={handleToResultScrnBtnPress}
                  backgroundColor={currentThemeObj.second}
                  dynamicStyles={{ padding: 15, borderRadius: 15 }}
                >
                  <PTxt>To Results Screen</PTxt>
                </Button>
              </View>
            </View>
            :
            <View style={{ marginTop: 20, gap: 10, justifyContent: "center", alignItems: "center", flexDirection: "row", width: "100%" }}>
              <Button
                handleOnPress={handleClearBtnPress}
                backgroundColor='#FFC12F'
                dynamicStyles={{ padding: 17, borderRadius: 15 }}
              >
                <PTxt>CLEAR</PTxt>
              </Button>
              <Button
                isDisabled={wasSkipBtnPressed}
                backgroundColor="#616771"
                handleOnPress={handleSkipBtnPress}
                dynamicStyles={{ padding: 17, borderRadius: 15 }}
              >
                <PTxt>
                  SKIP Q
                </PTxt>
              </Button>
              <Button
                backgroundColor="#4287FF"
                handleOnPress={handleSubmitBtnPress}
                dynamicStyles={{ padding: 17, borderRadius: 15 }}
              >
                <PTxt>SUBMIT</PTxt>
              </Button>
            </View>
          }
        </View>
      </Layout >
      <LoadingQsModal
        handleGetQuestionsBtnPress={handleGetQuestionsBtnPress}
        isThereAQToDisplay={!!question}
      />
    </>
  );
};

export default GameScrnPresentation;
