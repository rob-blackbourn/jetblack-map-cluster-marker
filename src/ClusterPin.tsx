import React from 'react'

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

export interface ClusterPinProps {
  // pixelOffset: [number, number]
  count: number
  size?: number
}

export default function ClusterPin({ count, size = 30 }: ClusterPinProps) {
  return (
    <div
      style={{
        ...styleFromCount(count, size),
        transform: `translate(-${size / 2}px, -${size / 2}px)`,
      }}
    >
      {count}
    </div>
  )
}
