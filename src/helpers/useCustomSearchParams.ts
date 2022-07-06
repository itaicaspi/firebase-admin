export const getSearchParams = () => {
  let params = Object.fromEntries(new URLSearchParams(window.location.search));
  let parsedParams: {[key: string]: Array<string>} = {}
  Object.keys(params).forEach((key) => {
    if (params[key] === "") {
      parsedParams[key] = []
    } else {
      parsedParams[key] = params[key].split(",")
    }
  })
  return parsedParams
}
export const paramsToSearchParamsString = (params: any) => {
  return (new URLSearchParams(params)).toString();
}