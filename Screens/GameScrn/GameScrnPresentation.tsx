
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, TouchableOpacity } from 'react-native'
import Layout from '../../global_components/Layout';
import { View } from 'react-native';
import { PTxt } from '../../global_components/text';
import { useColorStore, useIsGettingReqStore, useQuestionsStore } from '../../zustand';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ENGLISH_ALPHABET, LETTERS, SYMBOLS } from '../../globalVars';
import Button, { OnPressAction } from '../../global_components/Button';
import DraggableFlatList, {
  NestableScrollContainer,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import uuid from 'react-native-uuid';
import LogicSymbol from './components/LogicSymbol';
import SelectedLogicSymbol from './components/SelectedLogicSymbol';
import { NativeTouchEvent } from 'react-native';


const SELECTED_LOGIC_SYMBOLS_TESTING_DATA = [
  { symbol: "A", _id: uuid.v4() },
  { symbol: "->", _id: uuid.v4() },
  { symbol: "B", _id: uuid.v4() },
]

const TXT_FONT_SIZE = 20;
type TSelectedSymbol = typeof SYMBOLS[number] | typeof LETTERS[number]
interface ISelectedLogicSymbol {
  symbol: TSelectedSymbol
  _id: ReturnType<typeof uuid.v4>
  wasPressed?: boolean
}

const GameScrnPresentation = () => {
  const currentThemeStr = useColorStore(state => state.currentTheme);
  const colorThemesObj = useColorStore(state => state.themesObj);
  const currentColorsThemeObj = colorThemesObj[currentThemeStr];
  const questions = useQuestionsStore(state => state.questions);
  const task = useQuestionsStore(state => state.task);
  const isGettingQs = useIsGettingReqStore(state => state.isGettingQs);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedLogicSymbols, setSelectedLogicSymbols] = useState<ISelectedLogicSymbol[]>([]);
  const question = questions[questionIndex];
  const { choices, answer } = question ?? {};
  const letters = choices?.length ? choices.map(({ letter }) => letter) : (answer?.length ? answer.filter(choice => ENGLISH_ALPHABET.includes(choice)) : []);
  const symbolOptions: ISelectedLogicSymbol[] = useMemo(() => [...SYMBOLS, ...letters].map(symbol => ({
    symbol: symbol,
    _id: uuid.v4()
  })), []);

  function handleSymbolOptPress(selectedLogicSymbol: ISelectedLogicSymbol) {
    console.log("hey there: ")
    setSelectedLogicSymbols(prevState => [...prevState, { symbol: selectedLogicSymbol.symbol, _id: selectedLogicSymbol._id }])
  };

  function handleSelectedLogicSymbol(selectedLogicSymbol: ISelectedLogicSymbol) {
    // CASE: this was the first time that the SelectedLogicSymbol was clicked
    // GOAL: make its opacity .4 
    // the selected logic symbol's opacity has been changed to .4
    // the symbol that is not the target is returned unchanged
    // the target symbol was returned 
    // using the id of the pressed symbol, if the id matches with the id of the selectedSymbol, when the target symbol has been reached, change wasPressed to true
    // map through the state of selectedSymbols
    // wasPressed is false
    // check if wasPressed is false
    // the target symbol was retrieved
    // check if the target symbol was pressed by retrieving it from the state of selectedLoigcSymbols by using the id
    // get the id of the pressed symbol 
    // the user clicks on a symbol
    try {
      const targetSymbol = selectedLogicSymbols.find(({ _id }) => _id === selectedLogicSymbol._id);

      if (!targetSymbol) {
        throw new Error("Something went wrong couldn't retrieve the target symbol.")
      };

      if (!targetSymbol?.wasPressed) {
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
      
      // CASE: there was a symbol that was clicked already, the user clicks on another symbol to swap the values
      // GOAL: swap the symbols with one another in the state of the selectedLogicSymbols 
      // the symbols were swapped with one another
      // pseudo code of the swap:
      // selectedLogicSymbols[the index of symbol A] = symbolB 
      // selectedLogicSymbols[the index of symbol B] = symbolA 
      // symbolB = structureClone(selectedLogicSymbols[the index of symbolB])
      // symbolA = structureClone(selectedLogicSymbols[the index of symbolA])
      // store the symbols that will be swapped into their respective variables, as seen above:
      // symbolBIndex = find the index by getting the first value from the state of selectedLogicSymbols that has wasPressed === true
      // symbolAIndex (the most recently pressed symbol) = using the id of selectedLogicSymbol parameter, find it from the state of selectedLogicSymbols 
      // get the indexes of the pressed symbols, as seen above: 
      // there is a value that has the boolean of wasPressed set true

      // const previouslyPressedSelectedSymbolIndex = selectedLogicSymbols.findIndex(symbol => symbol.wasPressed);
      // const currentlyPressedSelectedSymbolIndex = selectedLogicSymbols.findIndex(symbol => symbol._id === selectedLogicSymbol._id);

      // if((currentlyPressedSelectedSymbolIndex !== -1) && (previouslyPressedSelectedSymbolIndex !== -1)){
      //   console.log("will execute swap...")
      // }

      setSelectedLogicSymbols(symbols => symbols.filter(({ _id }) => _id !== selectedLogicSymbol._id).map(symbol => ({ ...symbol, wasPressed: false })))
    } catch (error) {
      console.error("An error has occurred: ", error)
    }
    // const targetSymbol = selectedLogicSymbols.find(({ _id }) => )
  }

  function handleEnterBtnPress() {

  };


  function getIsAnswerCorrect() {

  };

  function handleClearBtnPress(event: GestureResponderEvent) {

  };

  function handleSubmitBtnPress(event: GestureResponderEvent) {

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
        flexDirection: 'column'
      }}
      backgroundColor="#343541"
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
            const _id = symbol._id.toString();

            return (
              <TouchableOpacity
                id={_id}
                onPress={() => handleSelectedLogicSymbol(symbol)}
                key={_id}
              >
                <LogicSymbol
                  width={55}
                  height={55}
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
          {symbolOptions.map(symbolOpt => (
            <TouchableOpacity
              key={symbolOpt._id.toString()}
              onPress={() => handleSymbolOptPress(symbolOpt)}
            >
              <LogicSymbol width={55} height={55} backgroundColor={currentColorsThemeObj.second}>
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
        <Button handleOnPress={handleSubmitBtnPress} backgroundColor='#4287FF' dynamicStyles={{ padding: 17, borderRadius: 15 }}>
          <PTxt>SUBMIT</PTxt>
        </Button>
      </View>
    </Layout>
  );
};

export default GameScrnPresentation;
