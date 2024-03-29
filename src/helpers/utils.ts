import {Timestamp} from "firebase/firestore";
import {getSearchParams} from "./useCustomSearchParams";

export const normalizeJson = (sortingFunction?: any) => {
  return (key: string, value: any) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object
        .entries(value)
        .sort(sortingFunction || undefined)
        .reduce((acc: any, entry) => {
          acc[entry[0]] = entry[1];
          return acc;
        }, {});
    }
    return value;
  }
}

export const isJson = (text: string) => {
  try {
    JSON.parse(text);
  } catch (e) {
    return false;
  }
  return true;
}

export const isTimestamp = (object: any) => {
  if (typeof object === "object" && object !== null) {
    if (object.hasOwnProperty('nanoseconds') && object.hasOwnProperty('seconds')) {
      return true;
    }
  }
  return false;
}

const toTimestamp = (object: any) => {
  return new Timestamp(object.seconds, object.nanoseconds);
}


export const normalizeTimestamps = (value: any) => {
  return isTimestamp(value) ? value.toDate().toLocaleString('en-US') : value
}

export const replaceTimestamps = (json: any) => {
  if (json && (Array.isArray(json) || typeof json == "object")) {
    Object.keys(json).forEach((key) => {
      if (isTimestamp(json[key])) {
        json[key] = toTimestamp(json[key]);
      } else {
        replaceTimestamps(json[key]);
      }
    })
  }
}

export const getDeepObjectPropByPath = (object: any, path: string) : any => {
  if (path === "" || object === undefined || object === null || Array.isArray(object) || typeof object !== "object") return object;
  return getDeepObjectPropByPath(object[path.split("/")[0]], path.split("/").slice(1).join("/"))
}

// function JSONstringifyOrder( obj, space )
// {
//   var allKeys = [];
//   var seen = {};
//   JSON.stringify(obj, function (key, value) {
//     if (!(key in seen)) {
//       allKeys.push(key);
//       seen[key] = null;
//     }
//     return value;
//   });
//   allKeys.sort();
//   return JSON.stringify(obj, allKeys, space);
// }

export const getPathComponents = (path: string) => {
  if (path.startsWith("/")) path = path.slice(1)
  if (path.endsWith("/")) path = path.slice(0, path.length - 1)
  return path.split("/");
}

export const isCollectionPath = (path: string) => {
  return getPathComponents(path).length % 2 === 1;
}

export const isDocumentPath = (path: string) => {
  return getPathComponents(path).length % 2 === 0;
}

export const getCollectionPathFromPath = (path: string) => {
  const pathComponents = getPathComponents(path)
  const collectionPartIndex = Math.floor((pathComponents.length - 1) / 2) * 2
  return pathComponents.slice(0, collectionPartIndex + 1).join("/")
}

export const getCollectionIdFromPath = (path: string) => {
  const pathComponents = getPathComponents(path)
  const collectionPartIndex = Math.floor((pathComponents.length - 1) / 2) * 2
  return pathComponents[collectionPartIndex]
}

export const getDocIdFromPath = (path: string) => {
  const pathComponents = path.split("/")
  if (pathComponents.length % 2 !== 0) return null;
  return pathComponents.at(-1);
}

export const getLeafIdFromPath = (path: string) => {
  const pathComponents = path.split("/");
  return pathComponents.at(-1);
}

export const initOrPushToArray = (value: any, initialArray?: Array<any>) => {
  if (initialArray === undefined) {
    return [value]
  } else {
    initialArray.push(value)
    return initialArray;
  }
}

export const unique = (arr: Array<any>) => Array.from(new Set(arr));


export const loadExtraInfoPropsForPath = (path: string) => {
  let newExtraInfoProps: {[key: string]: Array<string>} = getSearchParams()
  if (Object.keys(newExtraInfoProps).length === 0) {
    newExtraInfoProps = JSON.parse(localStorage.getItem(getCollectionIdFromPath(path)) ?? "{}")
  }
  return newExtraInfoProps
}