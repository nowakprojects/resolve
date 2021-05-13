import React, { useEffect, useCallback, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useReduxViewModel, useReduxCommand } from '@resolve-js/redux'
import { useSelector } from 'react-redux'

const ViewModelComponent = ({ salt, userId }) => {
  const { connect, dispose, selector } = useReduxViewModel({
    name: 'cumulative-likes',
    aggregateIds: [userId],
    args: {},
  })

  const {
    data: { likes },
  } = useSelector(selector)

  useEffect(() => {
    connect()
    return dispose
  }, [connect, dispose, selector])

  return <h3 id={`likes${salt}`}>{likes}</h3>
}

const ViewModelIsolationTests = ({
  match: {
    params: { runId },
  },
}) => {
  const userId = `user-${runId}`

  const [componentSwitch, setComponentSwitch] = useState(true)

  const { execute: like } = useReduxCommand({
    type: 'like',
    aggregateName: 'user',
    aggregateId: userId,
    payload: {},
  })

  const switcher = useCallback(() => {
    setComponentSwitch(false)
  }, [setComponentSwitch])

  const { execute: register } = useReduxCommand({
    type: 'register',
    aggregateName: 'user',
    aggregateId: userId,
    payload: {
      name: 'John Smith',
    },
  })

  return (
    <div className="example-wrapper">
      <Button onClick={register}>Register</Button>
      <Button onClick={like}>Like</Button>
      <Button onClick={switcher}>Unmount</Button>
      {!componentSwitch ? (
        <ViewModelComponent userId={userId} salt="1" />
      ) : null}
      {componentSwitch ? <ViewModelComponent userId={userId} salt="2" /> : null}
    </div>
  )
}

export { ViewModelIsolationTests }
