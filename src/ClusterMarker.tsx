import { useContext, useEffect, useState } from 'react'

import {
  MapContext,
  Coordinate,
  CLASS_NAMES,
  Point,
  calcScaleInfo,
  recenterScreenPoint,
  createVisiblePoints,
  limitCoordinate,
} from '@jetblack/map'
import { ClusterManager, CoordinateBounds, Node } from '@jetblack/cluster-manager'

const classNames = { clusterMarker: [CLASS_NAMES.primary, 'cluster-marker'].join(' ') }

export interface ClusterMarkerProps<T> {
  features: T[]
  renderPoint: (point: Point, node: Node<T>) => React.ReactElement
  renderCluster: (point: Point, node: Node<T>) => React.ReactElement
  getCoordinates: (point: T) => Coordinate
  makePoint: (coordinate: Coordinate, nodes: Node<T>[]) => T
}

export default function ClusterMarker<T>({
  features,
  renderPoint,
  renderCluster,
  getCoordinates,
  makePoint,
}: ClusterMarkerProps<T>) {
  const [clusterManager, setClusterManager] = useState<ClusterManager<T>>()
  const [clusters, setClusters] = useState<Node<T>[]>()
  const {
    bounds,
    center,
    tileProvider: { tileSize },
    worldBounds,
    zoom,
  } = useContext(MapContext)

  useEffect(() => {
    setClusterManager(new ClusterManager(features, getCoordinates, makePoint))
  }, [features, getCoordinates, makePoint])

  useEffect(() => {
    if (!clusterManager) {
      return
    }

    const bounds: CoordinateBounds = {
      northWest: limitCoordinate(worldBounds.northWest),
      southEast: limitCoordinate(worldBounds.southEast),
    }

    setClusters(clusterManager.getCluster(bounds, zoom))
  }, [clusterManager, worldBounds, zoom])

  const toPoints = (coordinate: Coordinate) => {
    // Get the screen coordinate of the point.
    const { roundedZoom, scale } = calcScaleInfo(zoom, bounds)
    const markerPoint = recenterScreenPoint(coordinate, center, zoom, bounds, tileSize)

    // If the screen is zoomed out the coordinate may appear many times as the display will wrap horizontally.
    return createVisiblePoints(markerPoint, roundedZoom, scale, bounds.width, tileSize.width)
  }

  return (
    <>
      {clusters &&
        clusters
          .map(node => ({
            node,
            points: toPoints(getCoordinates(node.data)),
          }))
          .flatMap(({ node, points }) =>
            points.map(point => (
              <div
                className={classNames.clusterMarker}
                key={`${point.x}-${point.y}`}
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  cursor: 'pointer',
                  transform: `translate(${point.x}px, ${point.y}px)`,
                }}
              >
                {node.nodes.length === 0 ? renderPoint(point, node) : renderCluster(point, node)}
              </div>
            ))
          )}
    </>
  )
}
