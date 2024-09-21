import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import globalStyles  from '../styles/global';

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
        style={styles.progressSteps}
        activeStep={activeStep}
        completedProgressBarColor={globalStyles.primaryRed.color} 
        activeStepIconBorderColor={globalStyles.primaryRed.color}
        activeLabelColor={globalStyles.primaryRed.color}
        completedStepIconColor={globalStyles.primaryRed.color}
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
        padding: 0,
        marginTop: -30,
      },
    stepContent: {
        flex: 1,
        marginTop: 15,
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
        backgroundColor: globalStyles.primaryRed.color,
        padding: 15,
        borderRadius: 5,
        margin: 10,
    },
    buttonText: {
        color: globalStyles.primaryRed.color,
        fontWeight: 'bold',
    },
});

export default MultiStepForm;
