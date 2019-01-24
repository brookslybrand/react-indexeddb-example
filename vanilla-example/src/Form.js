import React, { useState, useEffect } from 'react'
import { Offline, Online } from 'react-detect-offline'

const formStyle = { padding: '2rem 0rem' }
const inputStyle = { margin: '1rem 0rem' }

const Form = () => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')

  useEffect(() => {
    const request = window.indexedDB.open('FormDatabase', 1)

    request.onsuccess = function(event) {
      // get database from event
      const db = event.target.result

      // create transaction from database
      const transaction = db.transaction('formData', 'readwrite')

      // get store from transaction
      const dataStore = transaction.objectStore('formData')

      dataStore.get('firstname', 'lastname').onsuccess = function(event) {
        const { result } = event.target
        if (result && result.value) setFirstname(result.value)
      }

      dataStore.get('lastname').onsuccess = function(event) {
        const { result } = event.target
        if (result && result.value) setLastname(result.value)
      }
    }

    request.onerror = function(event) {
      console.log('[onerror]', request.error)
    }

    request.onupgradeneeded = function(event) {
      const db = event.target.result
      db.createObjectStore('formData', { keyPath: 'id' })
    }
  }, [])

  const setName = id => value => {
    const request = window.indexedDB.open('FormDatabase', 1)

    request.onsuccess = function(event) {
      // get database from event
      const db = event.target.result

      // create transaction from database
      const transaction = db.transaction('formData', 'readwrite')

      // get store from transaction
      const dataStore = transaction.objectStore('formData')

      dataStore.put({ id, value }).onsuccess = function(event) {
        window.indexedDB.open('FormDatabase', 1)
      }

      if (id === 'firstname') setFirstname(value)
      if (id === 'lastname') setLastname(value)
    }

    request.onerror = function(event) {
      console.log('[onerror]', request.error)
    }

    request.onupgradeneeded = function(event) {
      const db = event.target.result
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
