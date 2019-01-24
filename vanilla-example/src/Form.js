import React, { useState, useEffect } from 'react'
import { Offline, Online } from 'react-detect-offline'

const formStyle = { padding: '2rem 0rem' }
const inputStyle = { margin: '1rem 0rem' }

const Form = () => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')

  useEffect(() => {
    let db = window.indexedDB.open('FormDatabase', 1)

    db.onsuccess = function(event) {
      // get database from event
      let db = event.target.result

      // create transaction from database
      let transaction = db.transaction('formData', 'readwrite')

      // add success event handleer for transaction
      // you should also add onerror, onabort event handlers
      transaction.onsuccess = function(event) {
        console.log('[Transaction] ALL DONE!')
      }

      // get store from transaction
      let dataStore = transaction.objectStore('formData')

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

    db.onerror = function(event) {
      console.log('[onerror]', db.error)
    }

    db.onupgradeneeded = function(event) {
      let db = event.target.result
      db.createObjectStore('formData', { keyPath: 'id' })
    }
  }, [])

  const setName = id => value => {
    let db = window.indexedDB.open('FormDatabase', 1)

    db.onsuccess = function(event) {
      // get database from event
      let db = event.target.result

      // create transaction from database
      let transaction = db.transaction('formData', 'readwrite')

      // add success event handleer for transaction
      // you should also add onerror, onabort event handlers
      transaction.onsuccess = function(event) {
        console.log('[Transaction] ALL DONE!')
      }

      // get store from transaction
      let dataStore = transaction.objectStore('formData')

      dataStore.put({ id, value }).onsuccess = function(event) {
        console.log(
          '[Transaction - PUT] product with id 1',
          event.target.result
        )
        window.indexedDB.open('FormDatabase', 1)
      }

      if (id === 'firstname') setFirstname(value)
      if (id === 'lastname') setLastname(value)
    }

    db.onerror = function(event) {
      console.log('[onerror]', db.error)
    }

    db.onupgradeneeded = function(event) {
      let db = event.target.result
      db.createObjectStore('formData', { keyPath: 'id' })
    }
  }

  const handleSetName = id => e => setName(id)(e.target.value)

  // when the form is submitted, prevent the default action
  // which reloads the page and reset the first and last name
  const handleSubmit = e => {
    e.preventDefault()
    setName('firstname')('')
    setName('lastname')('')
  }

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <span>First name:</span>
      <br />
      <input
        style={inputStyle}
        type="text"
        name="firstname"
        value={firstname}
        onChange={handleSetName('firstname')}
        // onBlur={e => storeName('firstname')(e.target.value)}
      />
      <br />
      <span>Last name:</span>
      <br />
      <input
        style={inputStyle}
        type="text"
        name="lastname"
        value={lastname}
        onChange={handleSetName('lastname')}
        // onBlur={e => storeName('lastname')(e.target.value)}
      />
      <br />
      <Online>
        {' '}
        <input type="submit" value="Submit" />
      </Online>
      <Offline>You are currently offline!</Offline>
    </form>
  )
}

export default Form
