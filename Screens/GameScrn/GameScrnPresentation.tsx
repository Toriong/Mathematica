
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, TouchableOpacity } from 'react-native'
import Layout from '../../global_components/Layout';
import { View } from 'react-native';
import { PTxt } from '../../global_components/text';
import { useColorStore, useGameScrnTabStore, useIsGettingReqStore, useQuestionsStore } from '../../zustand';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ENGLISH_ALPHABET, LETTERS, OVERLAY_OPACITY, SYMBOLS, structuredClone } from '../../globalVars';
import Button, { OnPressAction } from '../../global_components/Button';
import DraggableFlatList, {
  NestableScrollContainer,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import uuid from 'react-native-uuid';
import LogicSymbol from './components/LogicSymbol';
import SelectedLogicSymbol from './components/SelectedLogicSymbol';
import { NativeTouchEvent } from 'react-native';

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

const GameScrnPresentation = () => {
  const currentThemeStr = useColorStore(state => state.currentTheme);
  const colorThemesObj = useColorStore(state => state.themesObj);
  const currentColorsThemeObj = colorThemesObj[currentThemeStr];
  const questions = useQuestionsStore(state => state.questions);
  const task = useQuestionsStore(state => state.task);
  const wasSubmitBtnPressed = useGameScrnTabStore(state => state.wasSubmitBtnPressed);

  useEffect(() => {
    console.log("wasSubmitBtnPressed: ", wasSubmitBtnPressed)
  });

  const setGameScrnTabStore = useGameScrnTabStore(state => state.updateState);
  const isGettingQs = useIsGettingReqStore(state => state.isGettingQs);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedLogicSymbols, setSelectedLogicSymbols] = useState<ISelectedLogicSymbol[]>([]);
  const question = questions[questionIndex];
  const { choices, answer } = question ?? {};
  const letters = choices?.length ? choices.map(({ letter }) => letter) : (answer?.length ? answer.filter(choice => ENGLISH_ALPHABET.includes(choice)) : []);
  const symbolOptions: ISelectedLogicSymbol[] = useMemo(() => [...SYMBOLS, ...letters].map(symbol => ({
    symbol: symbol,
    wasPressed: false
  })), [questions, questionIndex]);
  let isAnswerCorrect: boolean | null = null;

  if (wasSubmitBtnPressed) {
    isAnswerCorrect = JSON.stringify(answer) === JSON.stringify(selectedLogicSymbols.map(({ symbol }) => symbol));
  }

  function handleSymbolOptPress(selectedLogicSymbol: ISelectedLogicSymbol) {
    console.log("hey there: ")
    setSelectedLogicSymbols(prevState => [...prevState, { symbol: selectedLogicSymbol.symbol, _id: uuid.v4() }])
  };

  function handleSelectedLogicSymbol(selectedLogicSymbol: ISelectedLogicSymbol) {
    try {
      const targetSymbol = selectedLogicSymbols.find(({ _id }) => _id === selectedLogicSymbol._id);

      if (!targetSymbol) {
        throw new Error("Something went wrong couldn't retrieve the target symbol.")
      };

      const previouslyPressedSelectedSymbolIndex = selectedLogicSymbols.findIndex(({ wasPressed, _id }) => wasPressed && (selectedLogicSymbol._id !== _id));
      const currentlyPressedSelectedSymbolIndex = selectedLogicSymbols.findIndex(symbol => symbol._id === selectedLogicSymbol._id);

      if ((currentlyPressedSelectedSymbolIndex !== -1) && (previouslyPressedSelectedSymbolIndex !== -1)) {
        let selectedLogicSymbolsClone = structuredClone<ISelectedLogicSymbol[]>(selectedLogicSymbols);
        let previouslyPressedSelectedSymbol = structuredClone<ISelectedLogicSymbol>(selectedLogicSymbolsClone[previouslyPressedSelectedSymbolIndex]);
        let currentlyPressedSelectedSymbol = structuredClone<ISelectedLogicSymbol>(selectedLogicSymbolsClone[currentlyPressedSelectedSymbolIndex]);
        previouslyPressedSelectedSymbol.wasPressed = false;
        currentlyPressedSelectedSymbol.wasPressed = false;
        selectedLogicSymbolsClone[previouslyPressedSelectedSymbolIndex] = currentlyPressedSelectedSymbol;
        selectedLogicSymbolsClone[currentlyPressedSelectedSymbolIndex] = previouslyPressedSelectedSymbol;
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

  // GOAL: make the logic for that will check if the answer is correct.
  // 

  function handleEnterBtnPress() {

  };


  function getIsAnswerCorrect() {

  };

  function handleClearBtnPress(event: GestureResponderEvent) {

  };


  function handleSubmitBtnPress() {
    console.log("hey there!")
    setGameScrnTabStore(true, 'wasSubmitBtnPressed');
    console.log("wasSubmitBtnPressed: ", wasSubmitBtnPressed)
  };


  // BRAIN DUMP NOTES: 
  // when the user drags the element over the input field and releases the drag, perform the following: 
  // get the coordinates where the user releases the element
  // if it is in the input section field, then add that the element into the input section array

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
              <PTxt fontSize={30} txtColor={isAnswerCorrect ? 'green' : 'red'}>{isAnswerCorrect ? "CORRECT!" : "WRONG."}</PTxt>
              <PTxt fontSize={200}>
                {isAnswerCorrect
                  ?
                  "✅"
                  :
                  "❌"
                }
              </PTxt>
            </View>
          </>
        )
      }
    >
      <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
              <View style={{ display: 'flex', flexDirection: 'row', }}>
                <PTxt fontSize={TXT_FONT_SIZE}>{choice.letter} = </PTxt>
                <PTxt fontSize={TXT_FONT_SIZE} >{choice.value}{(index !== (self.length - 1)) ? ',' : ''}</PTxt>
              </View>
            ))
            }
          </View>
        </View>
      )}
      <View style={{ flex: 1, width: "100%", display: 'flex', alignItems: 'center' }}>
        <View
          style={{
            width: "93%",
            height: 70,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
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
                  width={SYMBOL_WIDTH_AND_HEIGHT}
                  height={SYMBOL_WIDTH_AND_HEIGHT}
                  backgroundColor={currentColorsThemeObj.second}
                >
                  {symbol.symbol}
                </LogicSymbol>
              </TouchableOpacity>
            )
          }
          )}
        </View>
      </View>
      <View style={{ flex: 1, width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {/* display placement of the tiles/choices */}
        <View style={{ display: 'flex', width: "80%", flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          {symbolOptions.map((symbolOpt, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSymbolOptPress(symbolOpt)}
            >
              <LogicSymbol width={SYMBOL_WIDTH_AND_HEIGHT} height={SYMBOL_WIDTH_AND_HEIGHT} backgroundColor={currentColorsThemeObj.second}>
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
