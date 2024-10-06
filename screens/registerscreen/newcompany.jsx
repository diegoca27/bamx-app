import React, { useState, useRef} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'; // Importa Picker
import MultiStepForm from '../../components/MultiStepForm';
import RNPickerSelect from 'react-native-picker-select'; 


const NewCompany = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: null, 
    industry: '',
    foundationDate: new Date(), 
    website: '', 
    employeeCount: '',
    annualRevenue: '',
    // ... otros campos para empresa
  });

  const handleSubmit = () => {
    // Envía formData al backend
    console.log("Enviando datos de empresa:", formData);
  };

  const [showDatePicker, setShowDatePicker] = useState(false);

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const pickerRef = useRef(); 

  const openPicker = () => {
    if (pickerRef.current) {
      pickerRef.current.focus();
    }
  };

  return (
    <View style={styles.container}>
      <MultiStepForm onSubmit={handleSubmit}>
        {/* Paso 1: Información Básica */}
        <View>
          <Text style={styles.label}>Nombre de la Empresa:</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, companyName: text })}
            placeholder="Ej. Tecnología Acme" 
          />

          <Text style={styles.label}>Tipo de Empresa:</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              placeholder={{
                label: 'Selecciona un tipo de empresa...',
                value: null,
              }}
              items={[
                { label: 'Sociedad Anónima', value: 'SA' },
                { label: 'Sociedad de Responsabilidad Limitada', value: 'SRL' },
                // ... Más tipos de empresa
              ]}
              onValueChange={(value) => setFormData({ ...formData, companyType: value })}
              value={formData.companyType}
              style={pickerSelectStyles} // Estilos personalizados (ver más abajo)
            />
          </View>

          <Text style={styles.label}>Industria:</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, industry: text })}
            placeholder="Ej. Tecnología, Alimentos, etc." 
          />

        </View>

        {/* Paso 2: Información Adicional (puedes agregar más pasos) */}
        <View>
          <Text style={styles.label}>Sitio Web:</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, website: text })}
            placeholder="Ej. www.ejemplo.com" 
            keyboardType="url" 
          />
          
        </View>

      </MultiStepForm>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 12,
    color: 'black',
    paddingRight: 30, // Espacio para el icono
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // Espacio para el icono
  },

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  countryCode: {
    marginLeft: 10,
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
});

export default NewCompany;
