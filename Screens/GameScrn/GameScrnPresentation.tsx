
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, GestureResponderEvent, LayoutChangeEvent, SafeAreaView, TouchableOpacity } from 'react-native'
import Layout from '../../global_components/Layout';
import { View } from 'react-native';
import { PTxt } from '../../global_components/text';
import { useApiQsFetchingStatusStore, useColorStore, useGameScrnTabStore, useQuestionsStore, useRequestStatusStore } from '../../zustand';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faArrowRight, faCancel } from "@fortawesome/free-solid-svg-icons";
import { LETTERS, OVERLAY_OPACITY, SYMBOLS, structuredClone } from '../../globalVars';
import Button from '../../global_components/Button';
import uuid from 'react-native-uuid';
import LogicSymbol from './components/LogicSymbol';
import EditSelectedSymbolBtn from './components/EditSelectedSymbolBtn';
import Modal from "react-native-modal";

const SYMBOL_WIDTH_AND_HEIGHT = 45;
const SELECTED_LOGIC_SYMBOLS_TESTING_DATA = [
  { symbol: "A", _id: uuid.v4() },
  { symbol: "->", _id: uuid.v4() },
  { symbol: "B", _id: uuid.v4() },
]
const TXT_FONT_SIZE = 20;
type TSelectedSymbol = typeof SYMBOLS[number] | typeof LETTERS[number]
interface ISelectedLogicSymbol {
  symbol: TSelectedSymbol
  _id?: ReturnType<typeof uuid.v4>
  wasPressed?: boolean
}


function getDeleteAndMoveSelectedSymbolBtns(
  handleMovementButtonPress: (num: 1 | -1) => void,
  handleDeleteSymbolButtonPress: () => void,
  opacity: 1 | .1
) {
  const areBtnsDisabled = opacity === .1;

  return [
    <EditSelectedSymbolBtn isDisabled={areBtnsDisabled} dynamicStyles={{ opacity: opacity }} backgroundColor="transparent" Icon={<FontAwesomeIcon size={25} icon={faArrowLeft} />} handleOnPress={() => { handleMovementButtonPress(-1) }} />,
    <EditSelectedSymbolBtn isDisabled={areBtnsDisabled} dynamicStyles={{ opacity: opacity }} backgroundColor="transparent" Icon={<FontAwesomeIcon size={25} color='red' icon={faCancel} />} handleOnPress={handleDeleteSymbolButtonPress} />,
    <EditSelectedSymbolBtn isDisabled={areBtnsDisabled} dynamicStyles={{ opacity: opacity }} backgroundColor="transparent" Icon={<FontAwesomeIcon size={25} icon={faArrowRight} />} handleOnPress={() => { handleMovementButtonPress(1) }} />,
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

const GameScrnPresentation = () => {
  const currentThemeStr = useColorStore(state => state.currentTheme);
  const colorThemesObj = useColorStore(state => state.themesObj);
  const currentColorsThemeObj = colorThemesObj[currentThemeStr];
  const questions = useQuestionsStore(state => state.questions);
  const task = useQuestionsStore(state => state.task);
  const wasSubmitBtnPressed = useGameScrnTabStore(state => state.wasSubmitBtnPressed);
  const rightNum = useGameScrnTabStore(state => state.right);
  const wrongNum = useGameScrnTabStore(state => state.wrong);
  const gameScrnMode = useGameScrnTabStore(state => state.mode);
  const gettingQsStatus = useApiQsFetchingStatusStore(state => state.gettingQsResponseStatus);
  const setGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswerArr, setCorrectAnswerArr] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLogicSymbols, setSelectedLogicSymbols] = useState<ISelectedLogicSymbol[]>([]);
  const [isModalShown, setIsModalShown] = useState(gettingQsStatus === "IN_PROGRESS");
  const question = questions[questionIndex];
  const { choices, answer, symbolOptions: symbolOptionsFromServer } = question ?? {};
  const symbolOptions = useMemo(() => [...SYMBOLS, ...symbolOptionsFromServer].map(symbol => ({
    symbol: symbol,
    wasPressed: false
  })), [questions, questionIndex]);
  let isAnswerCorrect: boolean | null = null;
  const isOnReviewMode = gameScrnMode === "review";

  if (wasSubmitBtnPressed) {
    isAnswerCorrect = JSON.stringify(answer) === JSON.stringify(selectedLogicSymbols.map(({ symbol }) => symbol));
  };

  useEffect(() => {
    if(isModalShown && (gettingQsStatus !== "IN_PROGRESS")){
      setIsModalShown(false);
    }
  }, [gettingQsStatus])

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
        })
      }

      return [...selectedLogicSymbols, newSelectedSymbol]
    })
  };

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

  function handleReviewQNavBtn(num: 1 | -1) {
    setQuestionIndex(index => {
      if ((index === 0) && (num === -1)) {
        return questions.length - 1
      };

      if ((index === (questions.length - 1)) && (num === 1)) {
        return 0;
      }

      return index + num
    });
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
    setGameScrnTabStore(true, 'isTimerPaused');
    let correctAnswerArr: string[] = [];
    let answerArrClone = structuredClone<string[]>(answer);
    const isAnswerCorrect = JSON.stringify(answer) === JSON.stringify(selectedLogicSymbols.map(({ symbol }) => symbol))

    // displaying the answer onto the ui by using the 'correctAnswerArr' state
    for (let index = 0; index < answerArrClone.length; ++index) {
      const currentAnswerSymbol = answerArrClone[index];
      const nextAnswerSymbol = answerArrClone[index + 1];

      if ((currentAnswerSymbol !== "~") || !nextAnswerSymbol) {
        correctAnswerArr.push(currentAnswerSymbol);
        continue
      }

      let newAnswerSymbol = `${currentAnswerSymbol}${nextAnswerSymbol}`;
      answerArrClone.splice(index + 1, 1);
      correctAnswerArr.push(newAnswerSymbol);
    }

    setCorrectAnswerArr(correctAnswerArr);

    setGameScrnTabStore(true, 'wasSubmitBtnPressed');

    setGameScrnTabStore(true, 'wasSubmitBtnPressed');

    setTimeout(() => {
      setSelectedLogicSymbols([]);

      setGameScrnTabStore(false, 'wasSubmitBtnPressed');

      setQuestionIndex(questionIndex => questionIndex + 1);

      setGameScrnTabStore(false, 'isTimerPaused');
    }, 2000);

    if (isAnswerCorrect) {
      setGameScrnTabStore(rightNum + 1, "right");
      return;
    }

    setGameScrnTabStore(wrongNum + 1, "wrong")
  };

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
      backgroundColor="#343541"
      layoutStyle={{ position: 'relative', width: '100%', height: '100%' }}
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
                txtColor={isAnswerCorrect ? 'green' : 'red'}
              >
                Correct Answer:
              </PTxt>
              <View
                style={{ display: 'flex', marginTop: 10, flexDirection: 'row', gap: 10, width: "100%", justifyContent: 'center', alignItems: 'center' }}
              >
                {correctAnswerArr.map((symbol, index) => (
                  <PTxt
                    key={index}
                    fontSize={30}
                    txtColor={isAnswerCorrect ? 'green' : 'red'}
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
      <Modal
        isVisible={isModalShown}
      >
        <PTxt>
          {gettingQsStatus === "IN_PROGRESS"
            ?
            "Getting questions..."
            :
            "Questions received ✅."
        }
        </PTxt>
        <ActivityIndicator size="large" />
      </Modal>
      <View style={{ flex: .7, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <PTxt fontSize={TXT_FONT_SIZE}>TASK: </PTxt>
        <PTxt
          fontSize={TXT_FONT_SIZE}
          style={{ textAlign: 'center', transform: [{ translateY: 20 }], paddingHorizontal: 11 }}
        >
          {task}
        </PTxt>
      </View>
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
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
            borderBottomWidth: 1,
            borderBottomColor: currentColorsThemeObj.second,
            position: 'relative',
          }}
        >
          {/* dispalay the user answer here when on review mode */}
          {isOnReviewMode ?
            <></>
            :
            !!selectedLogicSymbols.length && selectedLogicSymbols.map(symbol => {
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
                    {symbol.symbol === '∃' ? "E" : symbol.symbol}
                  </LogicSymbol>
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>
      <View style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!isOnReviewMode && (
          <View style={{
            display: "flex",
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: currentColorsThemeObj.second,
            width: "93%",
            gap: 8,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 8
          }}>
            {directionAndDeleteButtons.map(Button => (
              <View style={{
                width: SYMBOL_WIDTH_AND_HEIGHT,
                height: SYMBOL_WIDTH_AND_HEIGHT,
                backgroundColor: currentColorsThemeObj.second,
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
        <View style={{
          display: 'flex',
          width: "80%",
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 8
        }}
        >
          {symbolOptions.map((symbolOpt, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSymbolOptPress(symbolOpt)}
            >
              <LogicSymbol
                width={SYMBOL_WIDTH_AND_HEIGHT}
                height={SYMBOL_WIDTH_AND_HEIGHT}
                backgroundColor={currentColorsThemeObj.second}
                txtFontSize={24}
              >
                {symbolOpt.symbol}
              </LogicSymbol>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ flex: 1, width: "100%", marginTop: "5%", display: 'flex', flexDirection: 'row', gap: 10, alignItems: "center", justifyContent: 'center' }}>
        {isOnReviewMode ?
          <>
            <Button
              isDisabled={false}
              handleOnPress={_ => { handleReviewQNavBtn(-1) }}
              backgroundColor={currentColorsThemeObj.second}
              dynamicStyles={{ padding: 17, borderRadius: 15 }}

            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <Button
              isDisabled={false}
              handleOnPress={_ => { handleReviewQNavBtn(1) }}
              backgroundColor={currentColorsThemeObj.second}
              dynamicStyles={{ padding: 17, borderRadius: 15 }}

            >
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </>
          :
          <>
            <Button
              isDisabled={false}
              handleOnPress={handleClearBtnPress}
              backgroundColor='#FFC12F'
              dynamicStyles={{ padding: 17, borderRadius: 15 }}
            >
              <PTxt>CLEAR</PTxt>
            </Button>
            <Button
              backgroundColor="#4287FF"
              isDisabled={false}
              handleOnPress={handleSubmitBtnPress}
              dynamicStyles={{ padding: 17, borderRadius: 15 }}
            >
              <PTxt>SUBMIT</PTxt>
            </Button>
          </>
        }
      </View>
    </Layout>
  );
};

export default GameScrnPresentation;
