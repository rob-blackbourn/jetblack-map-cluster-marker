import React, { useCallback, useState } from 'react'

import { Point, Size } from '@jetblack/map'
import { Node } from '@jetblack/cluster-manager'

const colors = {
  small: ['rgba(181, 226, 140, 0.6)', 'rgba(110, 204, 57, 0.7)'],
  medium: ['rgba(241, 211, 87, 0.6)', 'rgba(240, 194, 12, 0.7)'],
  big: ['rgba(253, 156, 115, 0.6)', 'rgba(241, 128, 23, 0.7)'],
}
const defaultCountToColor = (count: number): string[] => {
  return count > 20 ? colors.big : count > 7 ? colors.medium : colors.small
}

const styleFromCount = (count: number, size: number): React.CSSProperties => {
  const colors = defaultCountToColor(count)
  return {
    width: size,
    height: size,
    borderRadius: '50%',
    borderWidth: 3,
    borderColor: colors[0],
    borderStyle: 'solid',
    background: colors[1],
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    cursor: 'default',
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

  console.log({ mouseOver, point, size })

  return (
    <div>
      <div
        style={{
          ...styleFromCount(count, size),
          transform: `translate(-${size / 2}px, -${size / 2}px)`,
          filter: mouseOver ? 'drop-shadow(0 0 4px rgba(0, 0, 0, .3))' : '',
          pointerEvents: 'auto',
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
