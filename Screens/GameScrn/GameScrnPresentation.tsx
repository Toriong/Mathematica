
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { PTxt } from '../../global_components/Text';
import { useIsGettingReqStore, useQuestionsStore } from '../../zustand';


// brain dump notes: 
// -venn diagram
// -propositions into symbolic logic 
// -propositions into extential/universal quantifier logic


// GAMES TO PLAY: 
// MAKE THE ARGUMENT VALID
// reduction ad absurdum problem? 

// FOR THE UI, for the choices, if there is no choices array, then get all of the letters from the answer array.

const GameScrnPresentation = () => {
  const questions = useQuestionsStore(state => state.questions);
  const task = useQuestionsStore(state => state.task);
  const isGettingQs = useIsGettingReqStore(state => state.isGettingQs);
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions[questionIndex];

  useEffect(() => {
    console.log("isGettingQs: ", isGettingQs)
    console.log("question yo there: ", question);
    console.log("task name: ", task);
  });

  function handleEnterBtnPress() {

  };

  function getIsAnswerCorrect() {

  }

  return (
    <View style={{ backgroundColor: '#343541', flex: 1, width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <PTxt>Hi</PTxt>
      {/* CASE: translate the proposition into symbolic propositional logic */}
      {/* SECTION 1: */}
      {/* display what the user must do with the text: Example: "Translate the proposition into symbolic logic." */}
      {/* END OF SECTION 1 */}

      {/* SECTION 2: */}
      {/* display the proposition here.*/}
      {/* END OF SECTION 2 */}

      {/* SECTION 3: */}
      {/* display the definition for each of the terms. For example: "P (one of the terms in the proposition)" */}
      {/* END OF SECTION 3 */}


      {/* SECTION 4: */}
      {/* display placement of the tiles */}
      {/* END OF SECTION 4 */}

      {/* SECTION 5: */}
      {/* display the choices to the user */}
      {/* END OF SECTION 5 */}


    </View>
  );
};

export default GameScrnPresentation;
