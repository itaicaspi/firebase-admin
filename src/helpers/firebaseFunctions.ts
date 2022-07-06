import {httpsCallable} from "firebase/functions";
import {functions} from "../firebase";

export const fetchCollections = async (path: string) : Promise<Array<any> | undefined> => {
  const getCollections = httpsCallable(functions, 'getCollections');
  const result = await getCollections({ path: path });
  const data: any = result.data;
  return data.collections;
}

export const cloneDoc = async (fromPath: string, toPath: string) : Promise<boolean | undefined> => {
  const getCollections = httpsCallable(functions, 'cloneDoc');
  const result = await getCollections({ fromDocPath: fromPath, toDocPath: toPath, deepClone: true });
  return result.data as boolean | undefined;
}

export const removeDoc = async (path: string) : Promise<boolean | undefined> => {
  const removeDoc = httpsCallable(functions, 'removeDoc');
  const result = await removeDoc({ docPath: path, deep: true });
  return result.data as boolean | undefined;
}

export const renameDoc = async (fromPath: string, toPath: string) : Promise<boolean | undefined> => {
  const renameDoc = httpsCallable(functions, 'renameDoc');
  const result = await renameDoc({ fromDocPath: fromPath, toDocPath: toPath });
  return result.data as boolean | undefined;
}