import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, Platform } from 'react-native';
import MultiStepForm from '../../components/MultiStepForm';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryPicker from 'react-native-country-picker-modal';
import globalStyles from '../../styles/global';

const NewPerson = () => {

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    phone: '',
    countryCode: '52',
    country: 'MX',
    email: '',
    address: '',
    colonia: '',
    city: '',
    postalCode: '',
    householdSize: '',
    monthlyIncome: '',
    hasDisability: false,
    disabilityDetails: '',
    receiveNotifications: false,
    foodPreference: '',
    acceptTerms: false,
  });

  const handleBirthDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // En iOS hay que ocultarlo manualmente
    if (event.type === 'set') {
      setFormData({ ...formData, birthDate: selectedDate });
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSubmit = () => {
    console.log("Enviando datos de persona:", formData);
  };

  const handlePhoneChange = (phoneNumber) => {
    setFormData({ ...formData, phoneNumber });
  };

  const handleCountryChange = (country) => {
    setFormData({ ...formData, countryCode: country.callingCode[0], country: country.cca2 });
  };

  return (
    <View style={styles.container}>
      <MultiStepForm onSubmit={handleSubmit}>
        {/* Paso 1: Información Personal */}
        <View>
          <Text style={styles.label}>Nombre Completo:</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, name: text })}
            value={formData.name}
            placeholder="Ej. Miguel Calvario Rodriguez"
          />
          <View>
          <Text style={styles.label}>Correo Electrónico:</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            placeholder="Ej. ejemplo@correo.com"
          />
          <Text style={styles.label}>Contraseña:</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, password: text })}
            secureTextEntry
          />
          </View> 
          <Text style={styles.label}>Fecha de Nacimiento:</Text>
          <View> 
            <Button onPress={showDatepicker} title="Seleccionar Fecha" color={globalStyles.primaryRed.color} />
            {showDatePicker && (
              <DateTimePicker
                value={formData.birthDate ? new Date(formData.birthDate) : new Date()}
                mode="date"
                display="default" 
                onChange={handleBirthDateChange}
              />
            )}
          </View> 
          <Text style={styles.label}>Número de Teléfono:</Text>
          <View style={styles.phoneContainer}>
          <CountryPicker
              countryCode={formData.country}
              withFilter
              withFlag
              withCallingCode
              onSelect={handleCountryChange}
            />
            <Text style={styles.countryCode}>+{formData.countryCode}</Text>
            <TextInput
              style={styles.phoneInput}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              placeholder="Ej. 333 000 0000"
            />
          </View>
        </View>
        
        {/* Paso 2: Información de Dirección */}
        <View>
          <Text style={styles.label}>Dirección (Calle y Número):</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, address: text })}
            value={formData.address}
          />
          <Text style={styles.label}>Colonia:</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, colonia: text })}
            value={formData.colonia}
          />
          <Text style={styles.label}>Ciudad:</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, city: text })}
            value={formData.city}
          />
          <Text style={styles.label}>Código Postal:</Text>
          <TextInput 
            style={styles.input}
            keyboardType="numeric"
            onChangeText={text => setFormData({ ...formData, postalCode: text })}
            value={formData.postalCode}
          />
        </View>
        
        {/* Paso 3: Información Familiar */}
        <View>
          <Text style={styles.label}>Número de Personas en el Hogar:</Text>
          <TextInput 
            style={styles.input}
            keyboardType="numeric"
            onChangeText={text => setFormData({ ...formData, householdSize: text })}
            value={formData.householdSize}
          />
          <Text style={styles.label}>Ingreso Mensual del Hogar (Rango):</Text>
          <TextInput 
            style={styles.input}
            onChangeText={text => setFormData({ ...formData, monthlyIncome: text })}
            value={formData.monthlyIncome}
          />
          <Text style={styles.label}>¿Posee algún tipo de discapacidad o necesidad especial?</Text>
          <Switch 
            value={formData.hasDisability} 
            onValueChange={value => setFormData({ ...formData, hasDisability: value })}
          />
          {formData.hasDisability && (
            <TextInput 
              style={styles.input}
              placeholder="Especifique"
              onChangeText={text => setFormData({ ...formData, disabilityDetails: text })}
              value={formData.disabilityDetails}
            />
          )}
        </View>
        
        {/* Paso 4: Preferencias y Términos */}
        <View>
          <Text style={styles.label}>¿Está dispuesto a recibir notificaciones de nuevas oportunidades?</Text>
          <Switch 
            value={formData.receiveNotifications} 
            onValueChange={value => setFormData({ ...formData, receiveNotifications: value })}
          />
          <Text style={styles.label}>Acepto los términos y condiciones</Text>
          <Switch 
            value={formData.acceptTerms} 
            onValueChange={value => setFormData({ ...formData, acceptTerms: value })}
          />
        </View>
      </MultiStepForm>
    </View>
  );
};

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
    borderWidth: 1,
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
    borderRadius: 12,
  },
});

export default NewPerson;
