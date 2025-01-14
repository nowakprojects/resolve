import { createCommentsReducer } from '@resolve-js/module-comments'

import { optimisticReducer } from './reducers/optimistic'
import { optimisticVotingSaga } from './sagas/optimistic-voting-saga'
import { storyCreateSaga } from './sagas/story-create-saga'
import { devTools } from './enhancers/redux-devtools'

const getRedux = ({ 'comments-hn': getCommentsOptions }, history) => {
  const {
    reducerName: commentsReducerName,
    ...commentsOptions
  } = getCommentsOptions()
  return {
    reducers: {
      [commentsReducerName]: createCommentsReducer(commentsOptions),
      optimistic: optimisticReducer,
      jwt: (jwt = {}) => jwt,
    },
    sagas: [optimisticVotingSaga, storyCreateSaga.bind(null, history)],
    enhancers: [devTools],
  }
}

export default getRedux
