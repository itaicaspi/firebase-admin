import create, {GetState, SetState, State} from "zustand";
import {db, functions} from "../firebase";
import {addDoc, collection, deleteDoc, doc, onSnapshot, setDoc,} from "firebase/firestore";
import {
  getCollectionIdFromPath,
  getCollectionPathFromPath,
  getDocIdFromPath, loadExtraInfoPropsForPath,
  replaceTimestamps
} from "../helpers/utils";
import {toast} from "react-hot-toast";
import {httpsCallable} from "firebase/functions";
import {cloneDoc, fetchCollections, removeDoc, renameDoc} from "../helpers/firebaseFunctions";

export interface SortBy {
  prop: string
  direction: "desc" | "asc"
}

export interface StoreInterface extends State {
  lastUpdate?: Date
  updatesAvailable: {[key: string]: boolean}
  unsubscribe: any
  fetchCollection: (collectionPath: string, callback: (result: { [key: string]: any }) => void) => any
  currentPath: string
  setCurrentPath: (currentPath: string) => Promise<string>
  currentCollectionPath: string
  setCurrentCollectionPath: (currentCollectionPath: string) => void
  currentDoc: any
  setCurrentDoc: (currentDoc: any) => void
  currentCollection: any
  setCurrentCollection: (currentCollection: any) => void
  currentSubCollections?: Array<any>
  currentParentCollections: any
  setCurrentSubCollections: (currentSubCollections?: Array<any>) => void,
  saveDoc: (newValue: string, prop?: string | undefined) => void,
  addDoc: (collectionPath: string, docId: string | null, content: string) => void,
  removeDoc: (docPath: string) => void,
  removeMultipleDocs: (collectionPath: string, docIds: Array<string>) => void,
  cloneDoc: (fromDocId: string, toDocId: string) => void,
  renameDoc: (fromDocId: string, toDocId: string) => void,
  toggleExtraInfoProp: (prop: string) => { [key: string]: Array<string> }
  handleSetExtraInfoPropsFilter: (prop: string, value: string) => { [key: string]: Array<string> }
  extraInfoProps: { [key: string]: Array<string> }
  setExtraInfoProps: (props: { [key: string]: Array<string> }) => void
  sortByProp?: SortBy
  setSortByProp: (sortByProp?: SortBy) => void
}



const useStore = create((
  set: SetState<StoreInterface>,
  get: GetState<StoreInterface>
) => ({
  lastUpdate: undefined,
  unsubscribe: undefined,
  updatesAvailable: {},
  fetchCollection: async (collectionPath: string, callback: (result: { [key: string]: any }) => void) => {
    if (get().unsubscribe) {
      get().unsubscribe();
    }
    const unsubscribe = onSnapshot(collection(db, collectionPath), (snapshot) => {
      let result: { [key: string]: any } = {};
      snapshot.docs.forEach(doc => {
        const docData = doc.data();
        if (docData) {
          result[doc.id] = docData;
        }
      })
      set({lastUpdate: new Date()})
      get().setCurrentCollection(result);
      callback(result);
    });
    set({unsubscribe})
  },
  currentPath: "",
  setCurrentPath: async (currentPath: string) : Promise<string> => {
    return new Promise(async (resolve, reject) => {
      // get root collections
      const pathComponents = currentPath.split("/");
      if (get().currentParentCollections.length === 0) {
        // fetch all the subcollections along the current path
        let parentCollections = [];
        for (let i = 0; i < pathComponents.length; i += 2) {
          let docPath = pathComponents.slice(0, i).join("/");
          let subCollections = await fetchCollections(docPath)
          parentCollections.push(subCollections)
        }
        set({currentParentCollections: parentCollections});
      } else {
        // update parent collections
        const requiredCollectionDepth = Math.max(1, Math.ceil(pathComponents.length / 2));
        const currentCollectionDepth = get().currentParentCollections.length;
        let relevantParentCollections;
        if (requiredCollectionDepth > currentCollectionDepth) {
          relevantParentCollections = [...get().currentParentCollections, get().currentSubCollections];
        } else {
          relevantParentCollections = get().currentParentCollections.slice(0, Math.ceil(pathComponents.length / 2));
        }
        set({
          currentParentCollections: relevantParentCollections,
        })
      }

      // check for collection change
      const newCollectionPath = pathComponents.length % 2 === 1 ? currentPath : pathComponents.slice(0, -1).join("/")
      if (get().currentCollectionPath !== newCollectionPath) {
        get().setSortByProp(undefined);
        get().setExtraInfoProps(loadExtraInfoPropsForPath(currentPath))
      }

      // get path data
      if (pathComponents.length % 2 === 1) {
        // collection
        set({
          currentSubCollections: [],
          currentCollection: {},
          currentDoc: []
        })
        get().fetchCollection(currentPath, (result: any) => {
          console.log("fetch collection", currentPath)
          const currentDocId = getDocIdFromPath(currentPath);
          // if (currentDocId in result) {
          //   get().setCurrentDoc(result[currentDocId])
          // } else {
          const firstDocId = Object.keys(result)[0]
          get().setCurrentDoc(result[firstDocId])
          if (currentPath.split("/").length % 2 === 1) {
            currentPath = `${currentPath}/${firstDocId}`
          }
          set({currentPath});
          // }
          resolve(currentPath)
        })
        get().setCurrentCollectionPath(currentPath)
        get().setCurrentDoc([])
        get().setCurrentSubCollections([])
      } else {
        // document
        const pathComponents = currentPath.split("/")
        set({currentSubCollections: undefined})
        if (currentPath !== "") {
          const docId: string = pathComponents.at(-1) ?? ""

          // mark doc as viewed
          const updatesAvailable = {...get().updatesAvailable};
          updatesAvailable[docId] = false;
          set({updatesAvailable})

          if (docId in get().currentCollection) {
            get().setCurrentDoc(get().currentCollection[docId])
          } else {
            const parentCollectionPath = pathComponents.slice(0, pathComponents.length - 1).join("/")
            get().fetchCollection(parentCollectionPath, (result: any) => {
              const docId = get().currentPath.split("/").at(-1)
              if (docId) {
                get().setCurrentDoc(result[docId])
              }
            })
            // getDoc(doc(db, currentPath)).then((snapshot) => {
            //   get().setCurrentDoc(snapshot.data())
            // })
          }
        }

        // fetch sub-collections
        fetchCollections(currentPath).then((result) => {
          get().setCurrentSubCollections(result);
        })
        get().setCurrentCollectionPath(pathComponents.slice(0, pathComponents.length - 1).join("/"))

        set({currentPath});
        resolve(currentPath)
      }
    })

  },
  currentCollectionPath: "",
  setCurrentCollectionPath: (currentCollectionPath: string) => set({currentCollectionPath}),
  currentSubCollections: undefined,
  currentParentCollections: [],
  setCurrentSubCollections: (currentSubCollections?: Array<any>) => set({currentSubCollections}),
  currentCollection: {},
  setCurrentCollection: (currentCollection: any) => {
    let updatesAvailable: {[key: string]: boolean} = {};
    const oldCollection = get().currentCollection;
    Object.keys(oldCollection).forEach((docId) => {
      updatesAvailable[docId] = JSON.stringify(oldCollection[docId]) !== JSON.stringify(currentCollection[docId])
    })
    set({currentCollection, updatesAvailable})
  },
  currentDoc: [],
  setCurrentDoc: (currentDoc: any) => set({currentDoc}),
  saveDoc: (newValue: string, prop?: string | undefined) => {
    let parsedValue = JSON.parse(newValue);
    let fullDoc;
    if (prop !== undefined) {
      fullDoc = get().currentDoc;
      fullDoc[prop] = parsedValue;
    } else {
      fullDoc = parsedValue;
    }
    replaceTimestamps(fullDoc)
    toast.promise(
      setDoc(
        doc(db, get().currentPath),
        fullDoc
      ),
      {
        loading: 'Saving...',
        success: <b>Saved successfully</b>,
        error: <b>Could not save.</b>,
      }
    );
  },
  addDoc: (collectionPath: string, docId: string | null, content: string) => {
    let fullDoc = JSON.parse(content);
    replaceTimestamps(fullDoc)

    const createDoc = async () => {
      if (docId !== null) {
        await setDoc(
          doc(db, collectionPath, docId),
          fullDoc
        )
      } else {
        const result = await addDoc(
          collection(db, collectionPath),
          fullDoc
        )
        docId = result.id
      }
      await get().setCurrentPath(`${collectionPath}/${docId}`);
    }

    toast.promise(
      createDoc(),
      {
        loading: 'Saving...',
        success: <b>Saved successfully</b>,
        error: <b>Could not save.</b>,
      }
    );
  },
  removeDoc: (docPath: string) => {
    const docId = getDocIdFromPath(docPath);
    toast.promise(
      removeDoc(
        docPath,
      ),
      {
        loading: 'Removing...',
        success: <b>Removed successfully</b>,
        error: <b>Could not remove.</b>,
      }
    ).then(() => {
      const newCollection = {...get().currentCollection};
      delete newCollection[docId];
      if (Object.keys(newCollection).length === 0) {
        const pathComponents = get().currentPath.split("/");
        let newPathComponents = pathComponents.slice(0, pathComponents.length - 2)
        get().setCurrentPath(newPathComponents.join("/"))
      } else {
        get().setCurrentCollection(newCollection)
      }
    })
  },
  removeMultipleDocs: (collectionPath: string, docIds: Array<string>) => {
    toast.promise(
      Promise.all(docIds.map((docId) => {
        return removeDoc(
          `${collectionPath}/${docId}`,
        )
      })),
      {
        loading: 'Removing...',
        success: <b>Removed successfully</b>,
        error: <b>Could not remove.</b>,
      }
    )
  },
  renameDoc: (fromDocId: string, toDocId: string) => {
    const collectionPath = get().currentCollectionPath;
    const fromDocPath = `${collectionPath}/${fromDocId}`;
    const toDocPath = `${collectionPath}/${toDocId}`;
    const newCollection = {...get().currentCollection};
    newCollection[toDocId] = newCollection[fromDocId];

    toast.promise(
      renameDoc(fromDocPath, toDocPath),
      {
        loading: 'Renaming...',
        success: <b>Renamed successfully</b>,
        error: <b>Could not rename.</b>,
      }
    ).then(() => {
      // at this point, the collection should already update automatically
      // navigate to the new path
      get().setCurrentPath([getCollectionPathFromPath(get().currentPath), toDocId].join("/"))
      delete newCollection[fromDocId];
      get().setCurrentCollection(newCollection)
    })
  },
  cloneDoc: (fromDocPath: string, toDocPath: string) => {
    toast.promise(
      cloneDoc(fromDocPath, toDocPath),
      {
        loading: 'Cloning...',
        success: <b>Cloned successfully</b>,
        error: <b>Could not clone.</b>,
      }
    );
  },
  /// show the property as extra info in the docs list
  toggleExtraInfoProp: (prop: string) : { [key: string]: Array<string> } => {
    const newExtraInfoProps: {[key: string]: Array<string>} = {...get().extraInfoProps};
    if (prop in newExtraInfoProps) {
      delete newExtraInfoProps[prop]
    } else {
      newExtraInfoProps[prop] = []
    }
    localStorage.setItem(getCollectionIdFromPath(get().currentPath), JSON.stringify(newExtraInfoProps))
    set({extraInfoProps: newExtraInfoProps})
    return newExtraInfoProps
  },

  /// adds a filter. for example show docs only if prop === value
  handleSetExtraInfoPropsFilter: (prop: string, value: string) : { [key: string]: Array<string> } => {
    let newExtraInfoPropValues: Array<string> = [...get().extraInfoProps[prop] ?? []];
    if (newExtraInfoPropValues.indexOf(value) > -1) {
      newExtraInfoPropValues.splice(newExtraInfoPropValues.indexOf(value), 1)
    } else {
      newExtraInfoPropValues = [...newExtraInfoPropValues, value]
    }
    const newExtraInfoProps = {...get().extraInfoProps, [prop]: newExtraInfoPropValues};
    set({extraInfoProps: newExtraInfoProps})
    return newExtraInfoProps;
  },
  extraInfoProps: {},
  setExtraInfoProps: (extraInfoProps: { [key: string]: Array<string> }) => set({extraInfoProps}),
  sortByProp: undefined,
  setSortByProp: (sortByProp?: SortBy) => set({sortByProp})
}));

export default useStore;
