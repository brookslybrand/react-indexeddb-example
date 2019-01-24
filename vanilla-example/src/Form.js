import React, { useState, useEffect } from 'react'

const Form = () => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(
    () => {
      if (navigator.onLine) setIsOnline(true)
      else setIsOnline(false)
    },
    [navigator.onLine]
  )

  useEffect(() => {
    let request = window.indexedDB.open('EXAMPLE_DB', 1)

    request.onsuccess = function(event) {
      // get database from event
      let db = event.target.result

      // create transaction from database
      let transaction = db.transaction('data', 'readwrite')

      // add success event handleer for transaction
      // you should also add onerror, onabort event handlers
      transaction.onsuccess = function(event) {
        console.log('[Transaction] ALL DONE!')
      }

      // get store from transaction
      let dataStore = transaction.objectStore('data')

      /*************************************/

      dataStore.get('firstname', 'lastname').onsuccess = function(event) {
        const { result } = event.target
        console.log('[Transaction - GET] product with id firstname', result)
        if (result && result.value) setFirstname(result.value)
      }

      dataStore.get('lastname').onsuccess = function(event) {
        const { result } = event.target
        console.log('[Transaction - GET] product with id lastname', result)
        if (result && result.value) setLastname(result.value)
      }
    }

    request.onerror = function(event) {
      console.log('[onerror]', request.error)
    }

    request.onupgradeneeded = function(event) {
      let db = event.target.result
      db.createObjectStore('data', { keyPath: 'id' })
    }
  }, [])

  const storeName = id => value => {
    let request = window.indexedDB.open('EXAMPLE_DB', 1)

    request.onsuccess = function(event) {
      // get database from event
      let db = event.target.result

      // create transaction from database
      let transaction = db.transaction('data', 'readwrite')

      // add success event handleer for transaction
      // you should also add onerror, onabort event handlers
      transaction.onsuccess = function(event) {
        console.log('[Transaction] ALL DONE!')
      }

      // get store from transaction
      let dataStore = transaction.objectStore('data')

      dataStore.put({ id, value }).onsuccess = function(event) {
        console.log(
          '[Transaction - PUT] product with id 1',
          event.target.result
        )
        window.indexedDB.open('EXAMPLE_DB', 1)
      }
    }

    request.onerror = function(event) {
      console.log('[onerror]', request.error)
    }

    request.onupgradeneeded = function(event) {
      let db = event.target.result
      db.createObjectStore('data', { keyPath: 'id' })
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    setFirstname('')
    setLastname('')
    storeName('firstname')('')
    storeName('lastname')('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <span>First name:</span>
      <br />
      <input
        type="text"
        name="firstname"
        value={firstname}
        onChange={e => setFirstname(e.target.value)}
        onBlur={e => storeName('firstname')(e.target.value)}
      />
      <br />
      <span>Last name:</span>
      <br />
      <input
        type="text"
        name="lastname"
        value={lastname}
        onChange={e => setLastname(e.target.value)}
        onBlur={e => storeName('lastname')(e.target.value)}
      />
      <br />
      {isOnline ? (
        <input type="submit" value="Submit" />
      ) : (
        'You are currently offline!'
      )}
    </form>
  )
}

export default Form
