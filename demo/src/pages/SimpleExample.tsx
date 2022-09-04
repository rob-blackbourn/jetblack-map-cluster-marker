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

interface NamedPlace {
  name: string
  coordinate: Coordinate
}

const places: NamedPlace[] = [
  {
    name: 'Buckingham Palace',
    coordinate: {
      latitude: 51.50134387851726,
      longitude: -0.14189001142749677,
    },
  },
  {
    name: 'Westminster Abbey',
    coordinate: {
      latitude: 51.4993615080601,
      longitude: -0.1272905862128543,
    },
  },
  {
    name: 'Big Ben',
    coordinate: {
      latitude: 51.50072251615747,
      longitude: -0.12462540039230506,
    },
  },
  {
    name: 'Arc de Triomphe',
    coordinate: {
      latitude: 48.87380579242423,
      longitude: 2.2950489562203154,
    },
  },
  {
    name: 'Eiffel Tower',
    coordinate: {
      latitude: 48.85832772680846,
      longitude: 2.294481298548385,
    },
  },
  {
    name: 'Notre Dame',
    coordinate: {
      latitude: 48.85311846253608,
      longitude: 2.3496164237012707,
    },
  },
]

export const sum = (a: number[]) => a.reduce((total, value) => total + value, 0)

const getCoordinates = (point: NamedPlace) => point.coordinate

const makePoint = (coordinate: Coordinate, nodes: Node<NamedPlace>[]): NamedPlace => ({
  name: `Cluster containing: ${nodes.flatMap(n => n.leaves()).join(', ')}`,
  coordinate,
})

export default function SimpleExample() {
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
        <h2>A simple example</h2>

        <p>
          Like the <code>Marker</code>, the <code>ClusterMarker</code> is a child of the{' '}
          <code>OverlayLayer</code>.
        </p>

        <p>
          You can view the source code{' '}
          <a href="https://github.com/rob-blackbourn/jetblack-map-cluster-marker/blob/master/demo/src/pages/SimpleExample.tsx">
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
            features={places}
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
                    <span>{node.data.name}</span>
                  </Popup>
                )}
              />
            )}
            renderCluster={(point, data) => <ClusterPin count={data.count()} />}
            getCoordinates={getCoordinates}
            makePoint={makePoint}
          />
        </OverlayLayer>
      </Map>
    </div>
  )
}
