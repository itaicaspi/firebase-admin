import {db} from "./firestore";
import {firestore} from "firebase-admin";
import DocumentData = firestore.DocumentData;
import CollectionReference = firestore.CollectionReference;

export const listSubCollections = async (docPath: string) => {
  let collections;
  if (docPath === "") {
    collections = await db.listCollections();
  } else {
    const ref = db.doc(docPath);
    collections = await ref.listCollections();
  }
  return collections.map((collection: CollectionReference<DocumentData>) => collection.id);
}

export const cloneCollection = async (fromCollectionPath: string, toCollectionPath: string) => {
  const allDocs: firestore.QuerySnapshot<firestore.DocumentData> = await db.collection(fromCollectionPath).get();
  const promises = allDocs.docs.map(
    (doc) => db.doc(`${toCollectionPath}/${doc.id}`).set(doc.data())
  );
  await Promise.all(promises);
}

export const cloneSubCollections = async (fromDocPath: string, toDocPath: string) => {
  const subCollections = await listSubCollections(fromDocPath);
  const promises = subCollections.map(
    (subCollectionId) => cloneCollection(`${fromDocPath}/${subCollectionId}`, `${toDocPath}/${subCollectionId}`)
  );
  await Promise.all(promises);
}

export const removeCollection = async (collectionPath: string) => {
  const allDocs: firestore.QuerySnapshot<firestore.DocumentData> = await db.collection(collectionPath).get();
  const promises = allDocs.docs.map(
    (doc) => db.doc(`${collectionPath}/${doc.id}`).delete()
  );
  await Promise.all(promises);
}

export const removeSubCollections = async (docPath: string) => {
  const subCollections = await listSubCollections(docPath);
  const promises = subCollections.map(
    (subCollectionId) => removeCollection(`${docPath}/${subCollectionId}`)
  );
  await Promise.all(promises);
}

export const cloneDoc = async (fromDocPath: string, toDocPath: string, deepClone?: boolean) => {
  const docSnapshot = await db.doc(fromDocPath).get();
  const docData = docSnapshot.data()
  if (docData) {
    await db.doc(toDocPath).set(docData);
  }
  if (deepClone) {
    await cloneSubCollections(fromDocPath, toDocPath);
  }
  return true;
}

export const removeDoc = async (docPath: string, deep?: boolean) => {
  await db.doc(docPath).delete();
  if (deep) {
    await removeSubCollections(docPath);
  }
  return true;
}