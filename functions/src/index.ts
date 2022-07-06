import * as functions from "firebase-functions";
import {cloneDoc, listSubCollections, removeDoc} from "./helpers";

exports.getCollections = functions.https.onCall(
  async (data, context) => {
    // const uid = context.auth?.uid;
    try {
      const path: any = data.path ?? "";
      return {collections: await listSubCollections(path)};
    } catch (e) {
      console.log(e)
    }
    return {}
  }
);

exports.cloneDoc = functions.https.onCall(async (data, context) => {
  try {
    const fromDocPath: any = data.fromDocPath;
    const toDocPath: any = data.toDocPath;
    const deepClone: boolean = data.deepClone ?? false;
    return await cloneDoc(fromDocPath, toDocPath, deepClone);
  } catch (e) {
    console.log(e)
  }
  return false
})

exports.renameDoc = functions.https.onCall(async (data, context) => {
  try {
    const fromDocPath: any = data.fromDocPath;
    const toDocPath: any = data.toDocPath;
    await cloneDoc(fromDocPath, toDocPath, true);
    return await removeDoc(fromDocPath, true);
  } catch (e) {
    console.log(e)
  }
  return false
})

exports.removeDoc = functions.https.onCall(async (data, context) => {
  try {
    const docPath: any = data.docPath;
    const deep: boolean = data.deep ?? false;
    return await removeDoc(docPath, deep);
  } catch (e) {
    console.log(e)
  }
  return false
})