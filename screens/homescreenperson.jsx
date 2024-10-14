import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import {
  StyleSheet, View, Dimensions, Image, Text,
  TouchableOpacity, TextInput, StatusBar, Linking,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const { width, height } = Dimensions.get('window');

const generateRandomLocation = (latitude, longitude, radiusInKm) => {
  const radiusInDegrees = radiusInKm / 111.32; // Aproximación: 1 grado = 111.32 km

  const u = Math.random();
  const v = Math.random();

  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;

  const newLatitude = latitude + w * Math.cos(t);
  const newLongitude = longitude + (w * Math.sin(t)) / Math.cos(latitude * (Math.PI / 180));

  return { latitude: newLatitude, longitude: newLongitude };
};


const HomeScreenPerson = () => {
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]); // Datos filtrados
  const sheetRef = useRef(null);
  const snapPoints = ['40%', '90%'];
  const theme = useTheme();
  const mapRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({});
  const [locationReady, setLocationReady] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [quantity, setQuantity] = useState(1); 

  const [markerSize, setMarkerSize] = useState(40); // Tamaño inicial
  const [showMarkers, setShowMarkers] = useState(true); // Inicializar showMarkers
  const confirmationSheetRef = useRef(null);
  const navigation = useNavigation();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [showInstructions, setShowInstructions] = useState(false);

  // Obtener la información de 'offers' de Firebase
  useEffect(() => {
    const fetchOffersAndCompany = async () => {
      try {
        // Obtener las ofertas
        const offersCollection = collection(db, 'offers');
        const offersSnapshot = await getDocs(offersCollection);
        const offersList = offersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
        // Obtener las compañías
        const companiesCollection = collection(db, 'company');
        const companiesSnapshot = await getDocs(companiesCollection);
        const companiesList = companiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
        // Combinar ofertas con compañías
        const mergedData = offersList.map(offer => {
          const companyInfo = companiesList.find(company => company.uid === offer.uid);
          return {
            ...offer,
            company: companyInfo || null, // Agrega la info de la compañía, si existe
          };
        });

        // Convertir lat y lon a números
        const mergedDataWithNumbers = mergedData.map(item => ({
          ...item,
          company: {
            ...item.company,
            lat: Number(item.company?.lat ?? 0),
            lon: Number(item.company?.lon ?? 0)
          }
        }));

        setData(mergedDataWithNumbers); // Guardar la información combinada en el estado
        setFilteredData(mergedDataWithNumbers);
        //console.log(mergedDataWithNumbers);
        
      } catch (error) {
        if (error instanceof AggregateError) {
          // AggregateError contiene múltiples errores.  Imprime cada uno:
          error.errors.forEach(e => console.error("Error individual:", e));
        } else {
          console.error("Error general al obtener datos:", error);
        }
      }
    };
  
    fetchOffersAndCompany();
  }, []);
  

  // Función para manejar la reserva 
  const handleReserve = () => {
    // Lógica para procesar la reserva
    // ...
    console.log("handleReserve se está ejecutando");
    console.log("selectedProduct:", selectedProduct);
    // Mostrar la pantalla de confirmación 
    setShowConfirmation(true);
    confirmationSheetRef.current?.expand();
  };

  const handlePayment = () => {
    // 1. Obtener la fecha y hora actual
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    console.log('selectedproduct en handlepay:', selectedProduct);
    // 2. Crear orderData
    const orderData = {
      customer: {
        id: user.uid, // Asumiendo que tu usuario tiene un ID
        name: user.name, // Obtener el nombre del usuario
        email: user.email,
      },
      company: {
        id: selectedProduct.company.uid,
        name: selectedProduct.company.companyName,
      },
      items: [
        {
          productId: selectedProduct.id,
          name: selectedProduct.productName,
          quantity: quantity,
          price: selectedProduct.offerPrice,
        },
      ],
      totalAmount: selectedProduct.offerPrice * quantity,
      quantity: quantity,
      date: formattedDate, // Agregar la fecha al pedido
      time: formattedTime, // Agregar la hora al pedido
      paymentMethod: 'Efectivo', // Ejemplo: Efectivo, Tarjeta, etc.
      status: 'Pendiente', // Ejemplo: Pendiente, En proceso, Listo para recoger, etc. 
    };
    const offerId = selectedProduct.id;

    setShowInstructions(true);
    setShowConfirmation(false); // Cierra el BottomSheet de confirmación
    productSheetRef.current?.close(); // Cierra el BottomSheet del producto
    navigation.navigate('Instructions', { orderData, offerId }); 
  };

  // Función para manejar la selección de un producto
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    productSheetRef.current?.expand();
  };

  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const renderProductBottomSheet = () => {
    return (
      <BottomSheet
        ref={productSheetRef}
        index={-1}
        snapPoints={['70%', '90%']}
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}
        enablePanDownToClose={true} 
        // Escucha el evento onChange para actualizar el estado isProductSheetOpen
        onChange={(index) => {
          //console.log('item dentro ', selectedProduct);
          setIsProductSheetOpen(index !== -1);

          // Cierra el Bottom Sheet de confirmación al cerrar el de producto
          if (index === -1) {
            setShowConfirmation(false);
          }
        }}
      >
        {selectedProduct && (
          <BottomSheetScrollView contentContainerStyle={styles.productSheetScrollContent}>
            <View style={styles.productSheetContent}>
              {/* Imagen del producto */}
              
              <Image 
                source={selectedProduct.foodImage ? { uri: selectedProduct.foodImage } : require('../assets/placeholder.png')}
                style={styles.productImage} 
              />

              {/* Información del producto */}
              <View style={styles.productInfo}>
                {/* Header del producto (nombre y rating) */}
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>{selectedProduct.productName || 'Wallace Market -Neuilly'}</Text>
                  <View style={styles.productTypeRating}>
                    <Text style={styles.productType}>{selectedProduct.company.companyName || 'Restaurant'}</Text>
                    <View style={styles.rating}>
                      <Ionicons name="star" size={16} color="gold" />
                      <Text style={styles.ratingText}>{selectedProduct.company.rating || '4.6'}</Text>
                    </View>
                  </View>
                </View>

                {/* Precio del producto */}
                <View style={styles.productPriceContainer}>
                  {selectedProduct.normalPrice && (
                    <Text style={styles.productOriginalPrice}>
                      ${selectedProduct.normalPrice} MXN
                    </Text>
                  )}
                  <Text style={styles.productPrice}>
                    ${selectedProduct.offerPrice || '3.99'} MXN
                  </Text>
                </View>

                {/* Información adicional (Ubicación y Hora) */}
                <View style={styles.productSection}>
                  <Ionicons name="location-outline" size={20} color="#666" />
                  <Text style={styles.productInfoText}>
                    {selectedProduct.company.address || '6 Boulevard de Neuilly, 92400 Courbevoie, France'}
                  </Text>
                </View>
                <View style={styles.productSection}>
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={styles.productInfoText}>
                      {selectedProduct.openTime && selectedProduct.closeTime
                        ? `${selectedProduct.openTime} - ${selectedProduct.closeTime}`
                        : '9:15 PM - 10:15 PM'}
                  </Text>
                </View>

                {/* Botón para ver en el mapa */}
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() => handleOpenGoogleMaps(selectedProduct.company.address)}
                >
                  <Ionicons name="map-outline" size={20} color="#007bff" />
                  <Text style={styles.mapButtonText}>Open Google Maps</Text>
                </TouchableOpacity>

                {/* Información de la canasta */}
                <View style={styles.basketContainer}>
                  <Image source={require('../assets/basket-outline.png')} style={styles.basketImage} />
                  <View style={styles.basketInfo}>
                    <Text style={styles.basketName}>
                      {selectedProduct.titleDescription || 'Notas adicionales'}
                    </Text>
                    <Text style={styles.basketDescription}>
                      {selectedProduct.additionalNotes || 'Un bel assortiment de fruits et legumes en fonction des jour'}
                    </Text>
                    <View style={styles.basketLeftContainer}>
                      <Ionicons name="basket-outline" size={14} color="#f0b400" />
                      <Text style={styles.basketLeftText}>
                        {selectedProduct.quantity ? `${selectedProduct.quantity} left` : '2 left'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Título de la compra */}
                <Text style={styles.purchaseTitle}>Compra de Carrito Individual</Text>

                {/* Botón de reserva */}
                <TouchableOpacity
                  style={styles.reserveButton}
                  onPress={() => handleReserve()}
                >
                  <Text style={styles.reserveButtonText}>Reservar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetScrollView>
        )}
      </BottomSheet>
    );
  };

  const handleRegionChangeComplete = (region) => {
    // Ajusta estos valores según tus preferencias
    if (region.longitudeDelta > 0.5) {
      setMarkerSize(20); // Tamaño más pequeño para zoom out
    } else if (region.longitudeDelta > 0.1) {
      setMarkerSize(25); // Tamaño intermedio
    } else {
      setMarkerSize(30); // Tamaño original para zoom in
    }
    if (region.longitudeDelta > 0.3) {
      setShowMarkers(false);
    } else {
      setShowMarkers(true);
    }
  };
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productSheetRef = useRef(null);

  const handleOpenGoogleMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  // Obtener ubicación actual
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso de ubicación denegado');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // La ubicación está lista, actualizar el estado
      setLocationReady(true);
    })();
  }, []);

  // Lógica de filtrado para la barra de búsqueda
  useEffect(() => {
    // Filtrar los datos obtenidos de Firebase
    const filtered = data.filter(item => {
      const searchTerm = searchQuery.toLowerCase();
      const productName = item.productName?.toLowerCase();
      const companyName = item.company?.companyName?.toLowerCase();

      return (
        productName?.includes(searchTerm) ||
        companyName?.includes(searchTerm)
      );
    });

    setFilteredData(filtered);
  }, [searchQuery, data]);

  const calculateRegion = (location, data) => {
    if (!location.latitude || !location.longitude || data.length === 0) {
      return {
        latitude: location.latitude || 0,
        longitude: location.longitude || 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    let minLat = location.latitude;
    let maxLat = location.latitude;
    let minLon = location.longitude;
    let maxLon = location.longitude;

    data.forEach((marker) => {
      const { latitude, longitude } = marker;

      if (latitude < minLat) minLat = latitude;
      if (latitude > maxLat) maxLat = latitude;
      if (longitude < minLon) minLon = longitude;
      if (longitude > maxLon) maxLon = longitude;
    });

    const latitudeDelta = (maxLat - minLat) * 1.5 || 0.01; // Ajusta el factor 1.5 para controlar el zoom
    const longitudeDelta = (maxLon - minLon) * 1.5 || 0.01;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLon + maxLon) / 2,
      latitudeDelta,
      longitudeDelta,
    };
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleProductSelect(item)}
      style={[styles.productContainer, selectedItem === item.id && styles.selectedItemContainer]}
    >
      <Image
      source={item.company.restaurantImage ? { uri: item.company.restaurantImage } : require('../assets/placeholder.png')}
      style={styles.productImageItem}
      onError={(error) => console.log('Error al cargar la imagen:', error)}
      />
      <View style={styles.productInfoItem}>
        <Text style={styles.itemName}>{item.company.companyName}</Text>
        <Text style={styles.itemType}>{item.productName}</Text>
        <View style={styles.itemDetails}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="gold" />
            <Text>{item.company.rating}</Text>
          </View>
          <View style={styles.priceContainer}>
            {item.isFree ? (
              <View style={styles.freeBadge}>
                <Text style={styles.freeText}>Gratis</Text>
              </View>
            ) : (
              <>
                {item.normalPrice && ( // Mostrar solo si existe precio original
                  <Text style={styles.originalPrice}>
                    ${item.normalPrice} MXN
                  </Text>
                )}
                <Text style={styles.itemPrice}>${item.offerPrice} MXN</Text>
              </>
            )}
          </View>
        </View>
        <View style={styles.itemDetails}>
          <View style={styles.detailGroup}>
            <Ionicons name="time-outline" size={16} color="gray" />
            <Text style={styles.productTime}>
              {item.openTime && item.closeTime
                ? `${item.openTime} - ${item.closeTime}`
                : '9:15 PM - 10:15 PM'}
            </Text>
          </View>
          <View style={styles.detailGroup}>
            <Ionicons name="location-outline" size={16} color="gray" />
            <Text style={styles.productDistance}>1 km</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    let markerFound = false;

    // Verificar si se presionó un marcador
    data.forEach((marker) => {
      if (
        Math.abs(marker.latitude - latitude) < 0.001 && // Ajusta la precisión si es necesario
        Math.abs(marker.longitude - longitude) < 0.001
      ) {
        markerFound = true;
      }
    });

    // Cerrar el BottomSheet y resetear el marcador seleccionado
    if (!markerFound) {
      productSheetRef.current?.close();
      setSelectedMarkerId(null);
    }
  };

  const handleMarkerPress = (marker) => {
    setSelectedProduct(marker);
    setSelectedMarkerId(marker.id); // Actualizar el ID del marcador seleccionado
    productSheetRef.current?.expand();
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1);
  };


  const renderConfirmationBottomSheet = () => {
    const totalPrice = selectedProduct ? selectedProduct.offerPrice * quantity : 0;
    console.log('item selected product', selectedProduct);
    // Función para actualizar confirmationSheetRef cuando el BottomSheet se abre
    const handleConfirmationSheetOpen = (sheetInstance) => {
      confirmationSheetRef.current = sheetInstance;
    };

    return (
      <BottomSheet
        ref={confirmationSheetRef}
        index={showConfirmation ? 0 : -1}
        snapPoints={['75%']}
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}
        enablePanDownToClose={true} // Habilitar cierre con swipe down
        onAnimateOpenEnd={handleConfirmationSheetOpen}
      >
        
        <View style={styles.confirmationContainer}>
          {/* Nombre del restaurante */}
          <Text style={styles.restaurantName}>
            {selectedProduct ? selectedProduct.company.companyName : 'Nombre del restaurante'}
          </Text>

          {/* Hora de recolección */}
          <View style={styles.pickupTimeContainer}>
            <Ionicons name="time-outline" size={15} color="#666" />
            <Text style={styles.pickupTimeText}>
              Recoger entre {selectedProduct && selectedProduct.company.openTime && selectedProduct.company.closeTime
                ? `${selectedProduct.company.openTime} - ${selectedProduct.company.closeTime}`
                : 'Hora de recolección'}
            </Text>
          </View>

          {/* Línea de separación */}
          <View style={styles.separator} />

          {/* Selección de cantidad */}
          <Text style={styles.selectQuantityText}>Seleccionar cantidad</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecreaseQuantity}
              disabled={!selectedProduct || quantity <= 1}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncreaseQuantity}
              disabled={quantity >= (selectedProduct?.quantity || 0)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Mapa */}
          <View style={styles.mapContainerConfirmation}>
            <MapView
              style={styles.mapConfirmation}
              initialRegion={{
                latitude: selectedProduct?.latitude || currentLocation.latitude,
                longitude: selectedProduct?.longitude || currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false} // Deshabilitar el desplazamiento en el mapa
            >
              <Marker
                coordinate={{
                  latitude: selectedProduct?.latitude || currentLocation.latitude,
                  longitude: selectedProduct?.longitude || currentLocation.longitude,
                }}
              />
            </MapView>
          </View>

          {/* Línea de separación */}
          <View style={styles.separator} />

          {/* Total y botón de pago */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}> ${totalPrice.toFixed(2)} MXN</Text>
          </View>

          {/* Términos y condiciones */}
          <Text style={styles.termsText}>
            Al reservar este producto, aceptas los Términos y Condiciones de AlimentaAPP.
          </Text>

          {/* Botón de compra */}
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handlePayment}
            disabled={quantity === 0}
          >
            <Text style={styles.buyButtonText}>Pagar en efectivo</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {currentLocation.latitude && currentLocation.longitude && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={calculateRegion(currentLocation, data)}
          showsUserLocation={true}
          onPress={handleMapPress}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {data.map((item) => {
          if (!item.company || typeof item.company.lat !== 'number' || typeof item.company.lon !== 'number') {
            console.warn(`Coordenadas faltantes o inválidas para la oferta ${item.id}`, item);
            return null;
          }
          return (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.company.lat,
                longitude: item.company.lon,
              }}
              onPress={() => handleMarkerPress(item)}
            >
              <Image
                source={
                  selectedMarkerId === item.id
                    ? require('../assets/location.png')
                    : item.productName === 'Hamburguesa'
                      ? require('../assets/prepared-food.png')
                      : require('../assets/basket-outline.png')
                }
                style={{ width: markerSize, height: markerSize }}
              />
            </Marker>
          );
        })}
        </MapView>
      )}

      {/* Bottom Sheet para mostrar los productos */}
      <BottomSheet
        ref={sheetRef}
        snapPoints={['25%', '50%', '90%']}
        index={0}
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
          data={filteredData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          renderItem={renderItem}
        />
      </BottomSheet>

      {/* Bottom Sheet para la información del producto */}
      {renderProductBottomSheet()}

      {/* Bottom Sheet de confirmación */}
      {showConfirmation && renderConfirmationBottomSheet(selectedProduct)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapContainer: {
    flex: 1,  // El mapa debe ocupar todo el espacio superior
    backgroundColor: '#ddd',  // Placeholder para el mapa, color gris
  },
  // Estilos para la barra de búsqueda y categorías
  searchAndCategoriesContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight + 20, // Ajustar posición según el notch
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchBarContainer: {
    marginBottom: 10,
  },
  categoriesList: {
    maxHeight: 40, // Ajusta la altura máxima de la lista de categorías
  },
  categoriesListContent: {
    paddingHorizontal: 5,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryButton: {
    backgroundColor: '#007bff',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  listContentContainer: {
    padding: 10,  // Espacio alrededor de los productos dentro del Bottom Sheet
    paddingBottom: 80,
  },
  productContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  productImage: {
    width: 80,  // Ancho de la imagen del producto
    height: 80,  // Altura de la imagen del producto
    borderRadius: 12,  // Bordes redondeados para las imágenes
    width: '100%',
    height: 200,
  },
  productImageItem: {
    width: '100%',
    height: 140,  // Ajusta la altura de la imagen
    borderRadius: 10,
    marginBottom: 10,  // Espacio entre la imagen y el contenido
  },
  productInfoItem: {
    marginTop: 10,
  },
  productName: {
    fontSize: 16,  // Tamaño de la fuente para el nombre del producto
    fontWeight: 'bold',  // Texto en negrita
    color: '#333',
  },
  productDetails: {
    flexDirection: 'row',  // Coloca la calificación y el precio en fila
    alignItems: 'center',  // Alinea verticalmente los elementos
    marginTop: 5,  // Espacio superior entre el nombre y los detalles
  },
  productRating: {
    marginLeft: 5,  // Espacio entre el icono de la estrella y la calificación
    marginRight: 10,  // Espacio entre la calificación y el precio
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPriceItem: {
    color: 'green',  // Color verde para el precio
    fontWeight: 'bold',  // Texto en negrita
  },
  productAdditionalDetails: {
    flexDirection: 'row',  // Coloca el tiempo y la distancia en fila
    alignItems: 'center',  // Alinea verticalmente los elementos
    marginTop: 5,  // Espacio superior entre los detalles principales y los adicionales
  },
  productTime: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 5,
    marginRight: 10,
  },
  productDistance: {
    fontSize: 12,
    color: 'gray',  // Color gris para el texto de la distancia
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
    marginBottom: 15,
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8, // considerar
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
    justifyContent: 'space-between', // Espacio entre los grupos
  },
  detailGroup: {
    flexDirection: 'row',
    alignItems: 'center',
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
  priceContainer: {
    alignItems: 'flex-end', // Alinea el precio a la derecha
  },
  productSheetScrollContent: {
    paddingBottom: 20,
  },
  productSheetContent: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    marginTop: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTypeRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productType: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },

  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  productPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: 'gray',
    marginRight: 5,
  },
  productOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  productInfoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  mapButtonText: {
    fontSize: 16,
    color: '#007bff',
    marginLeft: 8,
  },
  basketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  basketImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  basketInfo: {
    flex: 1,
  },
  basketName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  basketDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  basketLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  basketLeftText: {
    fontSize: 14,
    color: '#f0b400',
    marginLeft: 4,
  },
  veggieButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e6f5e1',
    alignSelf: 'flex-start',
  },
  veggieButtonText: {
    fontSize: 14,
    color: '#4caf50',
  },
  purchaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  reserveButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#ce0e2d',
    alignItems: 'center',
  },
  reserveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Estilos para el Bottom Sheet de confirmación
  confirmationContainer: {
    padding: 20,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  pickupTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  pickupTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 3,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  }, selectQuantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  mapContainerConfirmation: {
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  mapConfirmation: {
    ...StyleSheet.absoluteFillObject,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    paddingRight: 30,
    paddingLeft: 30,
  },
  buyButton: {
    backgroundColor: '#ce0e2d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default HomeScreenPerson;



