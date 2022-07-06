import {signOut} from 'firebase/auth';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {auth} from "../../firebase";
import useStore from "../../stores/store";
import {
  getCollectionIdFromPath,
  getDeepObjectPropByPath,
  getDocIdFromPath,
  initOrPushToArray,
  isTimestamp, normalizeJson,
  normalizeTimestamps
} from "../../helpers/utils";
import FirestorePath from "./FirestorePath";
import ExtraInfoSelector from "./ExtraInfoSelector";
import CollectionDocSelector from "./CollectionDocSelector";
import SubcollectionSelector from "./SubcollectionSelector";
import DocPropSelector from "./DocPropSelector";
import ExtendedCodeEditor from "./ExtendedCodeEditor";
import ImagePreview from "./ImagePreview";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {getSearchParams, paramsToSearchParamsString} from "../../helpers/useCustomSearchParams";
import ToolBar from "./ToolBar";
import FavoritesSelector from "./FavoritesSelector";
import CollectionActions from "./CollectionActions";

interface OwnProps {}

type Props = OwnProps;

const Dashboard: FunctionComponent<Props> = (props) => {
  const [searchBox, setSearchBox] = useState("");
  const [currentEditedContent, setCurrentEditedContent] = useState<any>(null);
  const [docFilter, setDocFilter] = useState<string | undefined>(undefined);
  const {currentDoc, currentCollection, currentSubCollections, currentPath, setCurrentPath,
    currentCollectionPath, saveDoc, lastUpdate, updatesAvailable, extraInfoProps, setSortByProp, sortByProp,
    setExtraInfoProps, handleSetExtraInfoPropsFilter, toggleExtraInfoProp} = useStore()
  const [beautifiedContent, setBeautifiedContent] = useState("");
  const [beautifyJson, setBeautifyJson] = useState(true);
  const location = useLocation()
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams()
  const [selectedDocs, setSelectedDocs] = useState<Array<string>>([]);
  const [relevantDocs, setRelevantDocs] = useState<Array<any>>([]);
  const [allStringProps, setAllStringProps] = useState<{[key: string]: Array<string>}>({});
  const [contentSize, setContentSize] = useState(0);

  console.log(currentPath)

  const logout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  const handleSetDocFilter = (newDocFilter: string) => {
    setCurrentEditedContent(null)
    setDocFilter((docFilter) => docFilter === newDocFilter ? undefined : newDocFilter)
  }

  const handleSetPath = async (path: string, force?: boolean, newExtraInfoProps?: {[key: string]: Array<string>}) => {
    let searchParams = newExtraInfoProps ?? extraInfoProps
    if (path !== currentPath || force) {
      if (path.split("/").length % 2 === 1) {
        // collection

        // navigating to a new collection requires resetting the extra info props so that it won't filter
        // the docs according to props that don't exist
        setExtraInfoProps({})
        searchParams = {}
      } else {
        // doc
      }
    }
    if (path !== currentPath) {
      setCurrentEditedContent(null)
      setDocFilter(undefined)
    }

    navigate({
      pathname: path,
      search: paramsToSearchParamsString(searchParams)
    })
    setCurrentPath(path).then((currentPath) => {
      if (newExtraInfoProps) {
        setExtraInfoProps(newExtraInfoProps)
      }
      if (currentPath !== path) {
        navigate({
          pathname: currentPath,
          search: paramsToSearchParamsString(searchParams)
        })
      }
    });
  }

  const initDashboard = () => {
    // parse path
    let defaultPath = location.pathname.slice(1);
    if (defaultPath === "") {
      defaultPath = "skincare_users";
    }

    // parse query params
    let newExtraInfoProps: {[key: string]: Array<string>} = getSearchParams()
    setExtraInfoProps(newExtraInfoProps)

    handleSetPath(defaultPath);
    setSearchParams(paramsToSearchParamsString(newExtraInfoProps))
  }


  const scrollCurrentDocIntoView = () => {
    setTimeout(() => {
      const docId = getDocIdFromPath(currentPath)
      document.getElementById(docId)?.scrollIntoView({block: "nearest", inline: "nearest", behavior: "smooth"})
    }, 500)
  }

  const beautifyContent = () => {
    const currentContent = docFilter != null ? currentDoc[docFilter] : currentDoc;
    let beautifiedContent;
    if (beautifyJson) {
      beautifiedContent = JSON.stringify(currentContent, normalizeJson(), 2)
    } else {
      beautifiedContent = JSON.stringify(currentContent)//, null, 2)
    }
    setBeautifiedContent(beautifiedContent)
    setContentSize(Math.round(new TextEncoder().encode(beautifiedContent).length / 1024))
    setCurrentEditedContent(null)
  }


  const handleSaveDoc = () => {
    saveDoc(currentEditedContent, docFilter);
    setCurrentEditedContent(null);
  }

  const handleSetAllStringProps = () => {
    let allStringProps: {[key: string]: Array<string>} = {};

    // adds all the prop values of an object to the allStringProps map.
    // for example, if the props are [firstName, lastName], it adds the values of this props (e.g. Itai, Caspi) to
    // the list of allStringProps[firstName] and allStringProps[lastName] correspondingly
    const addObjectProps = (object: any, prefix?: string) => {
      if (object) {
        Object.keys(object).forEach((prop) => {
          // parse types
          const isPropTimestamp = isTimestamp(object[prop]);
          const isString = typeof object[prop] == "string";
          const isNumber = typeof object[prop] == "number";
          const isObject = typeof object[prop] === "object";
          const isArray = Array.isArray(object[prop]);

          if (isString || isNumber || isPropTimestamp) {
            const propKey = prefix ? `${prefix}/${prop}` : prop;
            allStringProps[propKey] = initOrPushToArray(
              isPropTimestamp ? object[prop].toDate().toLocaleString('en-US') : object[prop],
              allStringProps[propKey]
            )
          } else if (isObject && !isArray) {
            // deep add. call this function recursively on this object
            addObjectProps(object[prop], prefix ? `${prefix}/${prop}` : prop)
          }
        })
      }
    }

    if (currentCollection) {
      Object.values(currentCollection).forEach((doc: any) => addObjectProps(doc))
      Object.keys(allStringProps).forEach(prop => allStringProps[prop] = Array.from(new Set(allStringProps[prop])).sort())
    }

    setAllStringProps(allStringProps)
  }

  const handleSetRelevantDocs = () => {
    const relevantDocs = Object.keys(currentCollection)
      .filter((docId) => {
        const doc = currentCollection[docId];
        let isRelevant = Object.keys(extraInfoProps).filter((prop) => prop in doc)
          .some((prop) => normalizeTimestamps(doc[prop])?.toLowerCase().indexOf(searchBox.toLowerCase()) > -1);
        isRelevant ||= docId.toLowerCase().indexOf(searchBox.toLowerCase()) > -1;
        isRelevant &&= Object.keys(extraInfoProps).every(
          (prop) => extraInfoProps[prop].length === 0 ||
            extraInfoProps[prop].indexOf(normalizeTimestamps(getDeepObjectPropByPath(doc, prop))) > -1
        )
        if (sortByProp) {
          isRelevant &&= getDeepObjectPropByPath(currentCollection[docId], sortByProp.prop) !== undefined
        }
        return isRelevant;
      }).sort((docId1, docId2) => {
        if (sortByProp) {
          const directionValue = sortByProp.direction === "asc" ? 1 : -1;
          return getDeepObjectPropByPath(currentCollection[docId1], sortByProp.prop) <
          getDeepObjectPropByPath(currentCollection[docId2], sortByProp.prop) ? directionValue : -directionValue
        } else {
          return docId1 < docId2 ? 1 : -1;
        }
      });

    setRelevantDocs(relevantDocs)
  }

  const clearSearchBox = () => {
    setSearchBox("");
  }

  /// Effects
  useEffect(initDashboard, []);
  useEffect(scrollCurrentDocIntoView, [currentPath, currentDoc]);
  useEffect(beautifyContent, [currentDoc, docFilter, beautifyJson]);
  useEffect(handleSetRelevantDocs, [currentCollection, extraInfoProps, searchBox, sortByProp]);
  useEffect(handleSetAllStringProps, [currentCollection]);
  useEffect(clearSearchBox, [currentCollectionPath]);


  return (
    <section className="flex justify-center flex-col items-center">
      <ImagePreview/>
      <div className="container mt-4 flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <img src="/favicon.png" alt="" className="w-8 h-8"/>
            <h5>
              Firebase Admin
            </h5>
          </h2>
          <button onClick={logout} className="border border-red-400 text-red-400 hover:bg-red-300 mb-4 px-4 py-1 rounded hover:text-white hover:bg-red-400 text-xs">
            logout
          </button>
        </div>

        <div className="flex justify-between">
          {/*Path*/}
          <FirestorePath currentPath={currentPath} onSetPath={handleSetPath}/>

          {/*Favorites*/}
          <FavoritesSelector onSetPath={setCurrentPath}/>
        </div>

        {/*Toolbar*/}
        <ToolBar
          relevantDocs={relevantDocs}
          currentPath={currentPath}
          setSearchBox={setSearchBox}
          currentCollection={currentCollection}
          lastUpdate={lastUpdate}
          searchBox={searchBox}
          handleSetPath={handleSetPath}
          selectedDocs={selectedDocs}
          setSelectedDocs={setSelectedDocs}
        />

        {/*Extra info*/}
        <div className="flex flex-col sm:flex-row gap-2 mt-4 items-start">
          <div className="flex-1">
            <CollectionActions
              currentCollectionPath={currentCollectionPath}
              relevantDocs={relevantDocs}
              selectedDocs={selectedDocs}
              setSelectedDocs={setSelectedDocs}
            />
          </div>
          <ExtraInfoSelector
            allStringProps={allStringProps}
            extraInfoProps={extraInfoProps}
            toggleExtraInfoProp={(prop) => {
              const result = toggleExtraInfoProp(prop);
              setSearchParams(paramsToSearchParamsString(result))
            }}
            setExtraInfoPropsFilter={(prop, value) => {
              const result = handleSetExtraInfoPropsFilter(prop, value);
              setSearchParams(paramsToSearchParamsString(result))
            }}
          />
        </div>

        {/*Collection*/}
        <CollectionDocSelector
          searchBox={searchBox}
          setSearchBox={setSearchBox}
          selectedDocs={selectedDocs}
          setSelectedDocs={setSelectedDocs}
          relevantDocs={relevantDocs}
          currentPath={currentPath}
          currentCollection={currentCollection}
          lastUpdate={lastUpdate}
          handleSetPath={handleSetPath}
          currentCollectionPath={currentCollectionPath}
          updatesAvailable={updatesAvailable}
          extraInfoProps={extraInfoProps}
          setExtraInfoPropsFilter={(prop, value) => {
            const result = handleSetExtraInfoPropsFilter(prop, value);
            setSearchParams(paramsToSearchParamsString(result))
          }}
        />

        {/*SubCollections*/}
        <SubcollectionSelector
          currentPath={currentPath}
          handleSetPath={handleSetPath}
          currentSubCollections={currentSubCollections}
        />

        <div className="flex space-x-4">
          {/*Doc keys*/}
          {
            currentDoc && Object.keys(currentDoc).length > 0 && (
              <DocPropSelector currentDoc={currentDoc} docFilter={docFilter} handleSetDocFilter={handleSetDocFilter}/>
            )
          }

          {/*Doc details*/}
          <div className="text-xs mt-4 self-end flex gap-4 items-center">
            <div>
              document size: {contentSize} kb
            </div>
            <button
              className={`${!beautifyJson ? "bg-gray-100" : "bg-blue-500 text-white"} px-3 py-1 rounded-full hover:bg-gray-200`}
              onClick={() => setBeautifyJson(!beautifyJson)}
            >
              beautify
            </button>
          </div>
        </div>

        {/*Doc content*/}
        <div className="flex flex-col relative mt-4 pb-10">
          <ExtendedCodeEditor
            onSave={handleSaveDoc}
            originalContent={beautifiedContent}
            editedContent={currentEditedContent ?? beautifiedContent}
            setCurrentEditedContent={setCurrentEditedContent}
            currentPath={currentPath}
          />
        </div>
      </div>

    </section>
  );
};

export default Dashboard;
