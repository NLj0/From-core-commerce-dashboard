export type TranslateFunction = (key: string) => string

export type SectionCommonProps = {
  dir: "ltr" | "rtl"
  isRTL: boolean
  t: TranslateFunction
}
