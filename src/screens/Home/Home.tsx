import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import type { Region } from 'react-native-maps'
import MapView, { Marker } from 'react-native-maps'

import MapFilter from '@/components/MapFilter/MapFilter'
import HomeButton from '@/components/MyTabBar/HomeButton'
import View from '@/components/View/View'
import mapStyle from '@/constants/mapStyle'
import { useMapFilter } from '@/store/mapFilterSlice'
import { MAP_ICONS } from '../EventForm/constants'
import useMarkers from './hooks/useMarkers'
import useUserLocation from './UserMarker/useUserLocation'
import { IMarkers } from '@/Models/Event'

export default function Home() {
  const mapRef = useRef<null | MapView>(null)

  const navigation = useNavigation()
  const { location } = useUserLocation()
  const { markers, requestMarkers } = useMarkers()
  const [markersInterator, setMarkersInterator] = useState(0)
  const isFocused = useIsFocused()
  const [mapRegion, setMapRegion] = useState<Region | undefined>()

  const { filters } = useMapFilter()

  const [showOverlay, setShowoverlay] = useState(false)

  const displayDetails = ({ id, title }: IMarkers) => {
    if (mapRegion) setMapRegion(undefined)
    navigation.navigate('EventDetails', {
      preview: { id, title },
    })
  }

  useFocusEffect(
    useCallback(() => {
      setShowoverlay(false)
      return () => {
        setShowoverlay(true)
      }
    }, [navigation])
  )

  useEffect(() => {
    if (location) requestMarkers(location, filters)
  }, [isFocused, location, JSON.stringify(filters)])

  useEffect(() => {
    if (location) setMapRegion(location)
  }, [location])

  function focusNextMarker() {
    const { lat, lng } = markers?.[markersInterator] || {}

    if (!lat || !lng) return

    setMarkersInterator((prev) => prev + 1)
    mapRef.current?.pointForCoordinate({ latitude: lat, longitude: lng })
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        minZoomLevel={11}
        style={styles.map}
        showsMyLocationButton={false}
        customMapStyle={mapStyle}
        region={mapRegion}
        showsUserLocation
      >
        {markers.map((marker, idx) => {
          return (
            <Marker
              key={marker.lat + marker.lng + idx}
              title={marker.title}
              image={MAP_ICONS[marker.icon || 0]}
              onPress={() => displayDetails(marker)}
              coordinate={{
                latitude: marker.lat,
                longitude: marker.lng,
              }}
            />
          )
        })}
      </MapView>
      <MapFilter />
      <HomeButton onPress={focusNextMarker} />
      {showOverlay && <View style={styles.overlay} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  map: {
    height: Dimensions.get('window').height + 100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  marker: {
    width: 50,
    height: 50,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 3,
    backgroundColor: '#00000081',
  },
})
