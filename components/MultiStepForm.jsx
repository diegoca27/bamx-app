import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

const MultiStepForm = ({ children, onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prevStep => prevStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      <ProgressSteps 
        activeStep={activeStep}
        completedProgressBarColor={'red'} 
        activeStepIconBorderColor={'red'}
        activeLabelColor={'red'}
        completedStepIconColor={'red'}
      >
        {children.map((child, index) => (
          <ProgressStep 
            key={index} 
            label={`Paso ${index + 1}`} 
            onNext={handleNext} 
            onPrevious={handleBack}
            nextBtnTextStyle={styles.buttonText}
            previousBtnTextStyle={styles.buttonText}
            nextBtnStyle={styles.buttonRight}
            previousBtnStyle={styles.buttonLeft}
          >
            <View style={styles.stepContent}>
              {child}
            </View>
          </ProgressStep>
        ))}
      </ProgressSteps>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    stepContent: {
        flex: 1,
    },
    buttonLeft: {
        alignSelf: 'flex-start',
        color: 'black'
    },
    buttonRight: {
        alignSelf: 'flex-end',
        color: 'black'
    },
    button: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 5,
        margin: 10,
    },
    buttonText: {
        color: 'red',
        fontWeight: 'bold',
    },
});

export default MultiStepForm;
