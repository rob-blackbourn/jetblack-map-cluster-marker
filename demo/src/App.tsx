import React, { useRef } from 'react'

import {
  Coordinate,
  Map,
  Point,
  osmTileProvider,
  useClick,
  useDrag,
  useZoom,
  OverlayLayer,
  SVGPin,
} from '@jetblack/map'

import { Node } from '@jetblack/cluster-manager'

import { Feature, Point as GeoPoint } from 'geojson'

import { ClusterMarker, ClusterPin } from '../../dist'

import places from './places.json'

export const sum = (a: number[]) => a.reduce((total, value) => total + value, 0)

const getCoordinates = (point: Feature<GeoPoint>) => ({
  latitude: point.geometry.coordinates[1],
  longitude: point.geometry.coordinates[0],
})

const makePoint = (
  coordinate: Coordinate,
  nodes: Node<Feature<GeoPoint>>[]
): Feature<GeoPoint> => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [coordinate.longitude, coordinate.latitude],
  },
  properties: {
    type: 'cluster',
    count: sum(nodes.map(node => node.count())),
  },
})

export default function App() {
  const ref = useRef<HTMLDivElement>(null)

  const [zoom, setZoom] = useZoom({ ref, defaultZoom: 2 })

  const [center, setCenter] = useDrag({
    ref,
    defaultCenter: { latitude: 51.4768, longitude: -0.0005 },
    zoom,
    tileSize: osmTileProvider.tileSize,
  })

  useClick({
    ref,
    center,
    zoom,
    tileSize: osmTileProvider.tileSize,
    onClick: (coordinate: Coordinate, point: Point) => console.log('click', { coordinate, point }),
    onDoubleClick: (coordinate: Coordinate, point: Point) => {
      // Zoom in on the new coordinate.
      setCenter(coordinate)
      setZoom(zoom + 1)
    },
  })

  return (
    <Map
      ref={ref} // Bind the ref to the map component.
      center={center} // The useDrag hook updates the center property.
      zoom={zoom} // The useZoom hook updates the zoom property.
      width="1000px"
      height="600px"
    >
      <OverlayLayer>
        <ClusterMarker
          features={places.features as Feature<GeoPoint>[]}
          renderPoint={(point: Point) => <SVGPin point={point} color="red" />}
          renderCluster={(point: Point, data: Node<Feature<GeoPoint>>) => (
            <ClusterPin count={data.count()} />
          )}
          getCoordinates={getCoordinates}
          makePoint={makePoint}
        />
      </OverlayLayer>
    </Map>
  )
}
