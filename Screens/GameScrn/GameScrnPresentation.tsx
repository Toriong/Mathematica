
import React, { useEffect, useState } from 'react';
import Layout from '../../global_components/Layout';
import { View } from 'react-native';
import { PTxt } from '../../global_components/text';
import { useColorStore, useIsGettingReqStore, useQuestionsStore } from '../../zustand';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";





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
  const question = questions[questionIndex];

  console.log("question: ", question)

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
      <View style={{ flex: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
      <View style={{ flex: 1.8, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* SECTION 3: */}
        {/* display the proposition here */}
        {/* END OF SECTION 3 */}
        <PTxt
          fontSize={TXT_FONT_SIZE}
          style={{ textAlign: 'center' }}
          fontStyle='italic'
        >
          {question.sentence}
        </PTxt>
      </View>
      <View style={{ flex: 1, width: "100%", display: 'flex', alignItems: 'center' }}>
        {/* display the input field here.*/}
        <View style={{ width: "93%", height: 80, backgroundColor: currentColorsThemeObj.second, borderTopRightRadius: 5, borderTopLeftRadius: 5 }}>

        </View>
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        {/* display the definitions of the choices */}
        <PTxt>yo</PTxt>
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        {/* display placement of the tiles/choices */}
        <PTxt>yo</PTxt>
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        {/* display the respone buttons here */}
        <PTxt>yo</PTxt>
      </View>

      {/* SECTION 5: */}
      {/* display the choices to the user */}
      {/* END OF SECTION 5 */}


    </Layout>
  );
};

export default GameScrnPresentation;
