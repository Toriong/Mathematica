
import React, { useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent } from 'react-native'
import Layout from '../../global_components/Layout';
import { View } from 'react-native';
import { PTxt } from '../../global_components/text';
import { useColorStore, useIsGettingReqStore, useQuestionsStore } from '../../zustand';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ENGLISH_ALPHABET, LETTERS, SYMBOLS } from '../../globalVars';
import Button, { OnPressAction } from '../../global_components/Button';
import uuid from 'react-native-uuid';
import LogicSymbol from './components/LogicSymbol';
import SelectedLogicSymbol from './components/SelectedLogicSymbol';





// brain dump notes: 
// -venn diagram
// -propositions into symbolic logic 
// -propositions into extential/universal quantifier logic


// GAMES TO PLAY: 
// MAKE THE ARGUMENT VALID
// reduction ad absurdum problem? 

// FOR THE UI, for the choices, if there is no choices array, then get all of the letters from the answer array.

const TXT_FONT_SIZE = 20;
type TSelectedSymbol = typeof SYMBOLS[number] | typeof LETTERS[number]
interface ISelectedLogicSymbol {
  symbol: TSelectedSymbol
  _id: ReturnType<typeof uuid.v4>
}

const GameScrnPresentation = () => {
  const currentThemeStr = useColorStore(state => state.currentTheme);
  const colorThemesObj = useColorStore(state => state.themesObj);
  const currentColorsThemeObj = colorThemesObj[currentThemeStr];
  const questions = useQuestionsStore(state => state.questions);
  const task = useQuestionsStore(state => state.task);
  const isGettingQs = useIsGettingReqStore(state => state.isGettingQs);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [pt1Coordinates, setPt1Coordinates] = useState({ x: 0, y: 0 });
  const [pt2Coordinates, setPt2Coordinates] = useState({ x: 0, y: 0 });
  const [selectedLogicSymbols, setSelectedLogicSymbols] = useState<ISelectedLogicSymbol[]>([
    { symbol: "A", _id: uuid.v4() },
    { symbol: "->", _id: uuid.v4() },
    { symbol: "B", _id: uuid.v4() },
  ]);

  // CASE: there are only three elements on the UI. The user takes the first element, and releases it
  // in between the second and third element. 
  
  const question = questions[16];
  const { choices, answer } = question ?? {};
  const letters = choices?.length ? choices.map(({ letter }) => letter) : (answer?.length ? answer.filter(choice => ENGLISH_ALPHABET.includes(choice)) : []);

  // setPtCoordinates: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>
  function handleOnLayout(event: LayoutChangeEvent) {
    console.log("pt1Ref.current: ",)
    // setPtCoordinates({ x: event?.nativeEvent?.layout?.x, y: event?.nativeEvent?.layout?.y  })
  }

  console.log("question: ", question);
  console.log("letters: ", letters)

  function handleEnterBtnPress() {

  };


  function getIsAnswerCorrect() {

  };

  function handleClearBtnPress(event: GestureResponderEvent) {

  };

  function handleSubmitBtnPress(event: GestureResponderEvent) {

  };

  useEffect(() => {

  })

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
        {/* CASE: translate the proposition into symbolic propositional logic */}
        {/* SECTION 1: */}
        {/* display what the user must do with the text: Example: "Translate the proposition into symbolic logic." */}
        {/* END OF SECTION 1 */}
        <PTxt fontSize={TXT_FONT_SIZE}>TASK: </PTxt>
        <PTxt
          fontSize={TXT_FONT_SIZE}
          style={{ textAlign: 'center', transform: [{ translateY: 20 }], paddingHorizontal: 11 }}
        >
          {task}
        </PTxt>
      </View>
      <View style={{ flex: 1, width: "100%", display: 'flex', paddingTop: 7, justifyContent: 'center', alignItems: 'center' }}>
        {/* SECTION 3: */}
        {/* display the proposition here */}
        {/* END OF SECTION 3 */}
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
        {/* display the input field here.*/}
        {/* the user must drag the letters and the operators here */}
        {/* the user can switch the tiles around when a tile is inserted */}
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
          {selectedLogicSymbols.length && selectedLogicSymbols.map(symbol => <SelectedLogicSymbol>{symbol.symbol}</SelectedLogicSymbol>)}
        </View>
      </View>
      <View style={{ flex: 1, width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {/* display placement of the tiles/choices */}
        <View style={{ display: 'flex', width: "80%", flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          {[...SYMBOLS, ...letters].map((symbol, index) => (
            <LogicSymbol width={55} height={55} key={index} backgroundColor={currentColorsThemeObj.second}>
              {symbol}
            </LogicSymbol>
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
