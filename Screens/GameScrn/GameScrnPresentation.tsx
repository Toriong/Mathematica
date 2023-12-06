
import React, { useEffect, useState } from 'react';
import Layout from '../../global_components/Layout';
import { View } from 'react-native';
import { PTxt } from '../../global_components/text';
import { useColorStore, useIsGettingReqStore, useQuestionsStore } from '../../zustand';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ENGLISH_ALPHABET, SYMBOLS } from '../../globalVars';





// brain dump notes: 
// -venn diagram
// -propositions into symbolic logic 
// -propositions into extential/universal quantifier logic


// GAMES TO PLAY: 
// MAKE THE ARGUMENT VALID
// reduction ad absurdum problem? 

// FOR THE UI, for the choices, if there is no choices array, then get all of the letters from the answer array.

const TXT_FONT_SIZE = 20;

const GameScrnPresentation = () => {
  const currentThemeStr = useColorStore(state => state.currentTheme);
  const colorThemesObj = useColorStore(state => state.themesObj);
  const currentColorsThemeObj = colorThemesObj[currentThemeStr];
  const questions = useQuestionsStore(state => state.questions);
  const task = useQuestionsStore(state => state.task);
  const isGettingQs = useIsGettingReqStore(state => state.isGettingQs);
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions[16];
  const { choices, answer } = question ?? {};
  const letters = choices?.length ? choices.map(({ letter }) => letter) : answer.filter(choice => ENGLISH_ALPHABET.includes(choice))

  // if the choices array does not exist, then get the letters from 'answer' array

  console.log("question: ", question);
  console.log("letters: ", letters)

  function handleEnterBtnPress() {

  };

  function getIsAnswerCorrect() {

  };

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
      <View style={{ flex: 1, width: "100%", display: 'flex', paddingTop: 7,justifyContent: 'center', alignItems: 'center' }}>
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
        <View style={{ width: "93%", height: 70, borderBottomWidth: 1, borderBottomColor: currentColorsThemeObj.second }}>

        </View>
      </View>
      <View style={{ flex: 1, width: "100%", display: 'flex', flexDirection: 'row',justifyContent: 'center', alignItems: 'center', borderWidth: 1 }}>
        {/* display placement of the tiles/choices */}
        <View style={{ display: 'flex', width: "80%",flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
        {[...SYMBOLS, ...letters].map(symbol => (
          <View style={{ borderRadius: 10, backgroundColor: currentColorsThemeObj.second, width: 55, height: 55, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PTxt
              fontSize={24}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
              {symbol}
            </PTxt>
          </View>
        ))}
        </View>
      </View>
      <View style={{ flex: 1, width: "100%" }}>
      {/* display the Submit and Clear button here */}
      </View>

      {/* SECTION 5: */}
      {/* display the choices to the user */}
      {/* END OF SECTION 5 */}


    </Layout>
  );
};

export default GameScrnPresentation;
