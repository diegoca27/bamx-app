import React, { useState, useRef, useEffect, useContext } from 'react';
import { StyleSheet, View, Dimensions, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Searchbar, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

const { width, height } = Dimensions.get('window');

const sampleData = [
  {
    id: 1,
    name: 'Restaurante A',
    type: 'Comida Preparada', 
    rating: 4.5,
    distance: '800m',
    time: '10-15 min',
    image: require('../assets/prepared-food.png'), // Reemplaza con la ruta de tu imagen
    isFree: false
  },
  {
    id: 2,
    name: 'Banco de Alimentos B',
    type: 'Ingredientes', 
    rating: 4.8,
    distance: '1.2km',
    time: '15-20 min',
    image: require('../assets/prepared-food.png'), // Reemplaza con la ruta de tu imagen
    isFree: true
  },
  {
    id: 3,
    name: 'Banco de Alimentos B',
    type: 'Ingredientes', 
    rating: 4.8,
    distance: '1.2km',
    time: '15-20 min',
    image: require('../assets/prepared-food.png'), // Reemplaza con la ruta de tu imagen
    isFree: true
  },
  {
    id: 4,
    name: 'Banco de Alimentos B',
    type: 'Ingredientes', 
    rating: 4.8,
    distance: '1.2km',
    time: '15-20 min',
    image: require('../assets/prepared-food.png'), // Reemplaza con la ruta de tu imagen
    isFree: true
  },
  // ... más datos
];

const HomeScreenPerson = () => {
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(sampleData); // Datos filtrados
  const sheetRef = useRef(null);
  const snapPoints = ['50%', '90%'];
  const theme = useTheme();
  const mapRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null); 

  const handleItemPress = (item) => {
    const latitude = item.latitude || currentLocation.latitude; 
    const longitude = item.longitude || currentLocation.longitude;
    // Actualizar la región del mapa
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01, // Puedes calcular esto dinámicamente si lo necesitas
      longitudeDelta: 0.01, 
    });

    //Actualizar el elemento seleccionado
    setSelectedItem(item.id);
    
    setTimeout(() => {
      setSelectedItem(null);
    }, 10);

    // Opcional: Cierra el BottomSheet después de seleccionar
    // sheetRef.current.close(); 
  };

  // Obtener ubicación actual (reemplaza con tu lógica)
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 48.8584, // Coordenadas de ejemplo: París
    longitude: 2.2945,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Lógica de filtrado para la barra de búsqueda
  useEffect(() => {
    const filteredData = sampleData.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setData(filteredData);
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => handleItemPress(item)} 
      style={[styles.itemContainer, selectedItem === item.id && styles.selectedItemContainer]}
    >
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemType}>{item.type}</Text>
        <View style={styles.itemDetails}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="gold" />
            <Text>{item.rating}</Text>
          </View>
          {item.isFree ? (
            <View style={styles.freeBadge}>
              <Text style={styles.freeText}>Gratis</Text>
            </View>
          ) : (
            <Text style={styles.itemPrice}>${item.price}</Text> 
          )}
        </View>
        <View style={styles.itemDetails}>
          <Ionicons name="location-outline" size={16} color="gray" />
          <Text style={styles.itemDistance}>{item.distance}</Text>
          <Ionicons name="time-outline" size={16} color="gray" />
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
        
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={currentLocation}
        showsUserLocation={true}
      >
        {data.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude || currentLocation.latitude,
              longitude: marker.longitude || currentLocation.longitude
            }}
            title={marker.name}
          >
            {marker.type === 'Comida Preparada' ? (
              <Ionicons name="fast-food-outline" size={24} color="red" />
            ) : (
              <Ionicons name="basket-outline" size={24} color="green" />
            )}
          </Marker>
        ))}
      </MapView>

      <BottomSheet
        ref={sheetRef}
        index={0} // <-- Empieza en el primer snapPoint 
        snapPoints={snapPoints} 
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}
      >
        <View style={styles.bottomSheetHeader}>
          <TextInput
            placeholder="Buscar comida..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.textInput} 
          />
        </View>
        <BottomSheetFlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 20,
    width: '90%',
    alignSelf: 'center',
  },
  searchBar: {
    borderRadius: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  itemImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 8, 
  },
  itemInfo: {
    flex: 1, 
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemType: {
    fontSize: 14,
    color: 'gray',
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginTop: 5,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10, 
  },
  freeBadge: {
    backgroundColor: 'green', 
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  freeText: {
    color: 'white',
    fontSize: 12, 
  },
  itemPrice: {
    color: 'green',
  },
  itemDistance: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 3, 
    marginRight: 8, 
  },
  itemTime: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 3, 
  },
  selectedItemContainer: {
    opacity: 0.5, 
  },
  bottomSheetHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  textInput: {
    height: 40,
    borderColor: 'lightgray', // <-- Borde gris claro
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 15, // <-- Esquinas redondeadas
    backgroundColor: 'white', // <-- Fondo blanco para el TextInput
    shadowColor: "#000", // <-- Sombra (opcional)
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0.5,
    elevation: 2,
  },
});

export default HomeScreenPerson;



