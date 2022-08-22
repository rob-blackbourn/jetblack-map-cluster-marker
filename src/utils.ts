import { Coordinate } from '@jetblack/map'

const sum = (a: number[]) => a.reduce((total, value) => total + value, 0)

const limitValue = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

export const limitCoordinate = ({ latitude, longitude }: Coordinate): Coordinate => ({
  latitude: limitValue(latitude, -90, 90),
  longitude: limitValue(longitude, -180, 180),
})
