<template>
  <div class="home" id="map" ref="map"></div>
</template>

<script>
import L from 'leaflet'
import { tiandituTileLayer } from '@supermap/iclient-leaflet'
export default {
  name: 'Home',
  components: {},
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      var url =
        'https://iserver.supermap.io/iserver/services/map-world/rest/maps/World'
      var map = L.map(this.$refs.map, {
        crs: L.CRS.EPSG4326,
        center: [0, 0],
        maxZoom: 18,
        zoom: 1,
      })
      // tiledMapLayer(url).addTo(map)
      tiandituTileLayer({ layerType: 'img' }).addTo(map) // 添加天地图图层
    },
  },
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
}
</style>
