import React, { useRef } from 'react'

import {
  Coordinate,
  Map,
  Point,
  Popup,
  osmTileProvider,
  useClick,
  useDrag,
  useZoom,
  OverlayLayer,
  Pin,
} from '@jetblack/map'

import { Node } from '@jetblack/cluster-manager'

import { Feature, Point as GeoPoint } from 'geojson'

import { ClusterMarker, ClusterPin } from '../../../dist'

import places from './geoJsonPlaces.json'

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
    name: nodes
      .flatMap(n => n.leaves())
      .map(n => n.data.properties?.name)
      .join(', '),
  },
})

export default function GeoJsonExample() {
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
    <div>
      <div>
        <h2>An example using GeoJSON data</h2>

        <p>
          The <code>getCoordinates</code> and <code>makePoint</code>
          handle the GeoJSON point features.
        </p>

        <p>
          You can view the source code{' '}
          <a href="https://github.com/rob-blackbourn/jetblack-map-cluster-marker/blob/master/demo/src/pages/GeoJsonExample.tsx">
            here
          </a>
          .
        </p>
      </div>

      <Map
        ref={ref} // Bind the ref to the map component.
        center={center} // The useDrag hook updates the center property.
        zoom={zoom} // The useZoom hook updates the zoom property.
        width={800}
        height={600}
      >
        <OverlayLayer>
          <ClusterMarker
            features={places.features as Feature<GeoPoint>[]}
            renderPoint={(point, node) => (
              <Pin
                point={point}
                color="blue"
                renderPopup={(point, size) => (
                  <Popup
                    style={{
                      backgroundColor: 'black',
                      color: 'white',
                      padding: 2,
                      borderRadius: 5,
                      fontSize: '75%',
                    }}
                    point={point}
                    leftShift={-size.width}
                    upShift={-size.height * 2}
                  >
                    <span>{node.data.properties?.name}</span>
                  </Popup>
                )}
              />
            )}
            renderCluster={(point, node) => (
              <ClusterPin
                point={point}
                count={node.count()}
                renderPopup={point => (
                  <Popup
                    style={{
                      backgroundColor: 'black',
                      color: 'white',
                      padding: 2,
                      borderRadius: 5,
                      fontSize: '75%',
                      width: 200,
                    }}
                    point={point}
                  >
                    <span>{node.data.properties?.name}</span>
                  </Popup>
                )}
              />
            )}
            getCoordinates={getCoordinates}
            makePoint={makePoint}
          />
        </OverlayLayer>
      </Map>
    </div>
  )
}
