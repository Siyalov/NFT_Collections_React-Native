// action: get collections
// action: get collections - success
// action: get collections - error
// variable: collections
// variable: error

import { AnyAction, Dispatch, applyMiddleware, combineReducers, createStore } from "redux";

import { NFTUserCollection } from "../api/serverData";
import thunk, { ThunkAction } from "redux-thunk";
import * as api from '../api';

export interface NFTCollectionsState {
  collections: Array<NFTUserCollection>;
  isLoading: boolean;
  error: string | null;
}

const initialState: NFTCollectionsState = {
  collections: [],
  isLoading: false,
  error: null,
};

export enum Actions {
  LOAD_COLLECTIONS = "NFTCollections/load_collections",
  LOAD_COLLECTIONS_SUCCESS = "NFTCollections/load_collections_success",
  LOAD_COLLECTIONS_ERROR = "NFTCollections/load_collections_error",
}

interface LoadCollectionsAction {
  type: Actions.LOAD_COLLECTIONS;
  payload?: {
    page: number;
  };
}
interface LoadCollectionsSuccessAction {
  type: Actions.LOAD_COLLECTIONS_SUCCESS;
  payload: Array<NFTUserCollection>;
}
interface LoadCollectionsErrorAction {
  type: Actions.LOAD_COLLECTIONS_ERROR;
  payload: string;
}

export type Action =
  | LoadCollectionsAction
  | LoadCollectionsSuccessAction
  | LoadCollectionsErrorAction;

export function collectionsReducer(
  state: NFTCollectionsState = initialState,
  action: Action
): NFTCollectionsState {
  switch (action.type) {
    case Actions.LOAD_COLLECTIONS:
      // TODO: call async API method
      return {
        ...state,
        isLoading: true,
      };
    case Actions.LOAD_COLLECTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        collections: [].concat(state.collections, action.payload),
      };
    case Actions.LOAD_COLLECTIONS_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

const reducers = combineReducers({
  nftCollections: collectionsReducer,
});

export function loadNFTCollections(page: number = 1): Action {
  return {
    type: Actions.LOAD_COLLECTIONS,
    payload: {
      page,
    }
  };
}
export function loadNFTCollectionsSuccess(collections: Array<NFTUserCollection>): Action {
  return {
    type: Actions.LOAD_COLLECTIONS_SUCCESS,
    payload: collections,
  };
}
export function loadNFTCollectionsError(error: string): Action {
  return {
    type: Actions.LOAD_COLLECTIONS_ERROR,
    payload: error,
  };
}

export function loadNFTCollectionsByPage(page = 1): ThunkAction<Promise<void>, NFTCollectionsState, unknown, AnyAction> {
  return async function(dispatch) {
    dispatch(loadNFTCollections(page));
    const collections = await api.getPage(page);
    if (collections) {
      dispatch(loadNFTCollectionsSuccess(collections));
    } else {
      dispatch(loadNFTCollectionsError('Error during loading'));
    }
  }
}


export const store = createStore(
  reducers,
  {
    nftCollections: initialState,
  },
  applyMiddleware(thunk),
);

export type StoreState = {
  nftCollections: NFTCollectionsState,
}