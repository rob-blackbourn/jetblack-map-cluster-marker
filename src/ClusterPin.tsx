import React, { useCallback, useState } from 'react'

import { Point, Size } from '@jetblack/map'
import { Node } from '@jetblack/cluster-manager'

export interface ClusterPinColor {
  borderColor: string
  background: string
}

const defaultColors = {
  small: {
    borderColor: 'rgba(181, 226, 140, 0.6)',
    background: 'rgba(110, 204, 57, 0.7)',
  },
  medium: {
    borderColor: 'rgba(241, 211, 87, 0.6)',
    background: 'rgba(240, 194, 12, 0.7)',
  },
  big: {
    borderColor: 'rgba(253, 156, 115, 0.6)',
    background: 'rgba(241, 128, 23, 0.7)',
  },
}

const defaultCountToColor = (count: number): ClusterPinColor => {
  return count > 20 ? defaultColors.big : count > 7 ? defaultColors.medium : defaultColors.small
}

const defaultMarkerStyle = (count: number, mouseOver: boolean): React.CSSProperties => {
  const { borderColor, background } = defaultCountToColor(count)
  return {
    borderColor: borderColor,
    background: background,
    filter: mouseOver ? 'drop-shadow(0 0 4px rgba(0, 0, 0, .3))' : '',
  }
}

export interface ClusterPinProps<T> {
  /** The point in the screen coordinate system. */
  point: Point
  /** The number of points in the cluster */
  count: number
  /** The radius of the circle marker */
  size?: number
  /** The node */
  node?: Node<T>
  /** A function called to render a popup when the mouse is over the pin */
  renderPopup?: (point: Point, size: Size, node?: Node<T>) => React.ReactElement
  /** A function called when the mouse enters or leaves the pin */
  onHover?: (mouseOver: boolean, point: Point, size: Size, node?: Node<T>) => void
  /** A handler for click events */
  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    point: Point,
    size: Size,
    node?: Node<T>
  ) => void
  /** A handler for a context menu event */
  onContextMenu?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    point: Point,
    size: Size,
    node?: Node<T>
  ) => void
  /** A callback for generating custom styles for a marker */
  markerStyle?: (count: number, mouseOver: boolean) => React.CSSProperties
}

export default function ClusterPin<T>({
  point,
  count,
  size = 30,
  node,
  renderPopup,
  onHover,
  onClick,
  onContextMenu,
  markerStyle = defaultMarkerStyle,
}: ClusterPinProps<T>) {
  const [mouseOver, setMouseOver] = useState(false)

  const width = 29 * size
  const height = 34 * size

  const handleMouseOver = useCallback(() => {
    setMouseOver(true)
    onHover && onHover(true, point, { width, height }, node)
  }, [setMouseOver, node, point, onHover])

  const handleMouseOut = useCallback(() => {
    setMouseOver(false)
    onHover && onHover(false, point, { width, height }, node)
  }, [])

  return (
    <div>
      <div
        style={{
          ...markerStyle(count, mouseOver),
          transform: `translate(-${size / 2}px, -${size / 2}px)`,
          pointerEvents: 'auto',
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: 'default',
          width: size,
          height: size,
          borderRadius: '50%',
          borderWidth: 3,
          borderStyle: 'solid',
        }}
        onClick={event => onClick && onClick(event, point, { width, height }, node)}
        onContextMenu={event =>
          onContextMenu && onContextMenu(event, point, { width, height }, node)
        }
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        {count}
      </div>
      {renderPopup && mouseOver && renderPopup(point, { width, height }, node)}
    </div>
  )
}
