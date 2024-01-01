
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, SafeAreaView, TouchableOpacity } from 'react-native'
import Layout from '../../global_components/Layout';
import { View } from 'react-native';
import { PTxt } from '../../global_components/text';
import { useColorStore, useGameScrnTabStore, useIsGettingReqStore, useQuestionsStore } from '../../zustand';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faArrowRight, faCancel } from "@fortawesome/free-solid-svg-icons";
import { ENGLISH_ALPHABET, LETTERS, OVERLAY_OPACITY, SYMBOLS, structuredClone } from '../../globalVars';
import Button, { OnPressAction } from '../../global_components/Button';
import DraggableFlatList, {
  NestableScrollContainer,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import uuid from 'react-native-uuid';
import LogicSymbol from './components/LogicSymbol';
import EditSelectedSymbolBtn from './components/EditSelectedSymbolBtn';
import { CustomError } from '../../utils/errors';


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


function getDeleteAndMoveSelctedSymbolBtns(
  handleMovementButtonPress: (num: 1 | -1) => void,
  handleDeleteSymbolButtonPress: () => void,
  opacity: number
) {
  return [
    <EditSelectedSymbolBtn dynamicStyles={{ opacity: opacity }} backgroundColor="transparent" Icon={<FontAwesomeIcon size={25} icon={faArrowLeft} />} handleOnPress={() => { handleMovementButtonPress(-1) }} />,
    <EditSelectedSymbolBtn dynamicStyles={{ opacity: opacity }} backgroundColor="transparent" Icon={<FontAwesomeIcon size={25} color='red' icon={faCancel} />} handleOnPress={handleDeleteSymbolButtonPress} />,
    <EditSelectedSymbolBtn dynamicStyles={{ opacity: opacity }} backgroundColor="transparent" Icon={<FontAwesomeIcon size={25} icon={faArrowRight} />} handleOnPress={() => { handleMovementButtonPress(1) }} />,
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
  const setGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswerArr, setCorrectAnswerArr] = useState<string[]>([]);
  const [selectedLogicSymbols, setSelectedLogicSymbols] = useState<ISelectedLogicSymbol[]>([]);
  const question = questions[questionIndex];
  const { choices, answer, symbolOptions: symbolOptionsFromServer } = question ?? {};
  const symbolOptions = useMemo(() => [...SYMBOLS, ...symbolOptionsFromServer].map(symbol => ({
    symbol: symbol,
    wasPressed: false
  })), [questions, questionIndex]);
  let isAnswerCorrect: boolean | null = null;

  if (wasSubmitBtnPressed) {
    isAnswerCorrect = JSON.stringify(answer) === JSON.stringify(selectedLogicSymbols.map(({ symbol }) => symbol));
  }

  function handleSymbolOptPress(selectedLogicSymbol: ISelectedLogicSymbol) {
    setSelectedLogicSymbols(prevState => [...prevState, { symbol: selectedLogicSymbol.symbol, _id: uuid.v4() }])
  };

  function handleMovementSymbolBtnPress(numToIncreaseSelectedIndexBy: -1 | 1) {
    try {
      const selectedSymbolIndex = selectedLogicSymbols.findIndex(({ wasPressed }) => wasPressed);
      let indexToSwitchSelectedSymbolWith: number | null = (selectedSymbolIndex === -1) ? null : (selectedSymbolIndex + (numToIncreaseSelectedIndexBy));

      if (selectedSymbolIndex === -1) {
        throw new Error("Failed to retrieve the selected symbol by the user.")
      };

      if ((selectedSymbolIndex === (selectedLogicSymbols.length - 1)) && (Math.sign(numToIncreaseSelectedIndexBy) === 1)) {
        indexToSwitchSelectedSymbolWith = 0
      } else if ((selectedSymbolIndex === 0) && (Math.sign(numToIncreaseSelectedIndexBy) === -1)) {
        indexToSwitchSelectedSymbolWith = selectedLogicSymbols.length - 1
      }

      const updatedSelectedSymbolsArr = getUpdatedSelectedSymbolsArr(
        indexToSwitchSelectedSymbolWith as number,
        selectedSymbolIndex,
        selectedLogicSymbols
      );
      setSelectedLogicSymbols(updatedSelectedSymbolsArr);
    } catch (error) {
      console.error("An error has occurred in moving the selected symbol: ", error);
    }
  }

  function handleDeleteSelectedSymbolBtnPress() {
    setSelectedLogicSymbols(selectedLogicSymbols => selectedLogicSymbols.filter(({ wasPressed }) => !wasPressed));
  };

  const pressedSelectedSymbol = selectedLogicSymbols ? selectedLogicSymbols.find(({ wasPressed }) => wasPressed) : null;
  const directionAndDeleteButtons = useMemo(() => getDeleteAndMoveSelctedSymbolBtns(handleMovementSymbolBtnPress, handleDeleteSelectedSymbolBtnPress, pressedSelectedSymbol ? 1 : .1), [pressedSelectedSymbol]);

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
        const selectedLogicSymbolsUpdated = selectedLogicSymbols.map(symbol => {
          if (symbol._id === selectedLogicSymbol._id) {
            return {
              ...symbol,
              wasPressed: true
            }
          }

          return symbol;
        });

        setSelectedLogicSymbols(selectedLogicSymbolsUpdated);
        return;
      };


      setSelectedLogicSymbols(symbols => {
        const symbolsFiltered = symbols.filter(({ _id }) => _id !== selectedLogicSymbol._id)

        return symbolsFiltered?.length ? symbolsFiltered.map(symbol => ({ ...symbol, wasPressed: false })) : symbolsFiltered;
      })
    } catch (error) {
      console.error("An error has occurred: ", error)
    }
  }

  function handleEnterBtnPress() {

  };

  function getIsAnswerCorrect() {

  };

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
          {!!selectedLogicSymbols.length && selectedLogicSymbols.map(symbol => {
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
                  pTxtStyle={(symbol.symbol === "E") ? { transform: [{ rotateY: "180deg" }] } : {}}
                >
                  {symbol.symbol}
                </LogicSymbol>
              </TouchableOpacity>
            )
          }
          )}
        </View>
      </View>
      <View style={{ flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                pTxtStyle={(symbolOpt.symbol === "E") ? { transform: [{ rotateY: "180deg" }] } : {}}
              >
                {symbolOpt.symbol}
              </LogicSymbol>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={{ flex: 1, width: "100%", marginTop: "5%", display: 'flex', flexDirection: 'row', gap: 10, alignItems: "center", justifyContent: 'center' }}>
        <Button handleOnPress={handleClearBtnPress} backgroundColor='#FFC12F' dynamicStyles={{ padding: 17, borderRadius: 15 }}>
          <PTxt>CLEAR</PTxt>
        </Button>
        <TouchableOpacity
          onPress={handleSubmitBtnPress}
          style={{ padding: 17, borderRadius: 15, backgroundColor: "#4287FF" }}
        >
          <PTxt>SUBMIT</PTxt>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

export default GameScrnPresentation;
