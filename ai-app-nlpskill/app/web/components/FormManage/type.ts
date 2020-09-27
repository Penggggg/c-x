export interface formType {
  key: string,
  label?: string,
  width?: number | string,
  itemWidth?: number | string,
  placeholder?: string,
  type?: string,
  tooltip?: string | React.ReactNode,
  prefix?: string | React.ReactNode,
  extraNode?: React.ReactNode | any,
  extraInput?: React.ReactNode | any,
  options?: Array<any>,
  disabled?: boolean,
  initialValue?: any,
  groupHidden?: boolean,
  name?: any,
  rules?: Array<{
    required: boolean,
    message?: string
  }>,
  onChange?: (item) => void,
  render?: () => void
}
