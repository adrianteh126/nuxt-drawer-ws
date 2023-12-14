export type Point = { x: number; y: number }

export type DrawLine = {
  previousPoint: Point | null
  currentPoint: Point
  lineColor: string
}
