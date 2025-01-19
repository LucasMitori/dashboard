<script setup lang="ts">
import { ref } from 'vue'

interface Marker {
	position: { lat: number; lng: number };
	icon: string;
	label: string;
}

const isLoaded = ref(false);
const googleMapsRef = ref();
const maps = ref()

const center = ref({
	lat:  -37.7995487,
	lng: 144.9867841,
})

const brazilBounds = {
	north: 5.2718, 
  south: -33.7510,
  east: -34.7931,
  west: -73.9828,
}


const locations = ref([
  { name: 'São Paulo', lat: -23.55052, lng: -46.633308, type: 'call' },
  { name: 'Rio de Janeiro', lat: -22.906847, lng: -43.172896, type: 'chat' },
  { name: 'Brasília', lat: -15.826691, lng: -47.921822, type: 'call' },
  { name: 'Salvador', lat: -12.9714, lng: -38.5014, type: 'chat' },
])

const mapOptions = {
  styles: [
    { elementType: 'labels', stylers: [{ visibility: 'off' }, { color: '#f49f53' }] },
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f9ddc5' }, { lightness: -7 }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#813033' }, { lightness: 43 }] },
    { featureType: 'poi.business', elementType: 'geometry', stylers: [{ color: '#645c20' }, { lightness: 38 }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1994bf' }, { saturation: -69 }, { gamma: 0.99 }, { lightness: 43 }] },
    { featureType: 'road.local', elementType: 'geometry.fill', stylers: [{ color: '#f19f53' }, { weight: 1.3 }, { visibility: 'on' }, { lightness: 16 }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#645c20' }, { lightness: 39 }] },
    { featureType: 'poi.school', elementType: 'geometry', stylers: [{ color: '#a95521' }, { lightness: 35 }] },
    { featureType: 'poi.medical', elementType: 'geometry.fill', stylers: [{ color: '#813033' }, { lightness: 38 }, { visibility: 'off' }] },
  ],
}

const redIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
const blueIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'

// const markers = ref<Marker[]>([])
const markers = ref([])

// function loadMarkers() {
//   markers.value = locations.value.map(loc => ({
//     position: { lat: loc.lat, lng: loc.lng },
//     icon: loc.type === 'call' ? redIcon : blueIcon, 
//     label: loc.name,
//   }))
// }

function handleReady({ map }: { map: any }) {

  const bounds = new google.maps.LatLngBounds()
  bounds.extend({ lat: brazilBounds.north, lng: brazilBounds.west })
  bounds.extend({ lat: brazilBounds.south, lng: brazilBounds.east })
  
  map.value.fitBounds(bounds),
  
  isLoaded.value = true
//   loadMarkers()
}

// onMounted(() => {
// 	markers.value = googleMapsRef.value.createAdvancedMapMarker({
//     position: { 
// 		lat: -23.55052, lng: -46.633308,
// 	}
//   })
// })

</script>

<template>
  <v-card class="pa-5">
    <v-card-title class="text-h6">Company SAC Map</v-card-title>
    <v-card-text>
      <div class="mapsBox">
        <div class="flex items-center justify-center">
			<ScriptGoogleMaps
				trigger="immediate"
				ref="maps"
				:center="center"
				:markers="markers"
				api-key="AIzaSyAx_39-8X2_CJXpWEO_Qn6-JtFLbwPCbTk"
				class="group"
				above-the-fold
				@ready="handleReady"
				:mapOptions="mapOptions"
			>

				<template #loading>
					<div class="bg-blue-500 text-white p-5">
						Loading...
					</div>
				</template>
			</ScriptGoogleMaps>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>

.mapsBox {
	min-width: 300px;
  	height: 100%;
}
</style>
