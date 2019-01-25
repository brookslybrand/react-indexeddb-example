import React, { useState, useEffect } from 'react'
import { Offline, Online } from 'react-detect-offline'

// some inline styling so everything isn't squished
const formStyle = { padding: '2rem 0rem' }
const inputStyle = { margin: '1rem 0rem' }

// a simple form with a first name, last name, and submit button
const Form = () => {
  const [names, setNames] = useState({ firstname: '', lastname: '' })

  // set firstname and lastname to whatever is in the database
  // if no values are in the database, set the database values to ''
  useEffect(() => {
    const request = window.indexedDB.open('FormDatabase', 1)

    request.onsuccess = function(event) {
      // get database from event
      const db = event.target.result

      // create transaction from database
      const transaction = db.transaction('formData', 'readwrite')

      // get store from transaction
      const dataStore = transaction.objectStore('formData')

      // if the first or last name fields have been stored, set them
      // as the state hook values
      dataStore.get('firstname').onsuccess = function(event) {
        const { result } = event.target
        if (result && result.value) {
          setNames(prevNames => ({ ...prevNames, firstname: result.value }))
        }
      }

      dataStore.get('lastname').onsuccess = function(event) {
        const { result } = event.target
        if (result && result.value) {
          setNames(prevNames => ({ ...prevNames, lastname: result.value }))
        }
      }
    }

    // log any errors
    request.onerror = function(event) {
      console.log('[onerror]', request.error)
    }

    // handle if an upgrade is needed
    request.onupgradeneeded = function(event) {
      const db = event.target.result
      db.createObjectStore('formData', { keyPath: 'id' })
    }
  }, []) // only run effect when mounted

  // sets the name in the store and in the state hook
  const setName = id => value => {
    const request = window.indexedDB.open('FormDatabase', 1)

    request.onsuccess = function(event) {
      // get database from event
      const db = event.target.result

      // create transaction from database
      const transaction = db.transaction('formData', 'readwrite')

      // get store from transaction
      const dataStore = transaction.objectStore('formData')

      // update the value for the id
      dataStore.put({ id, value }).onsuccess = function(event) {
        window.indexedDB.open('FormDatabase', 1)
      }

      // update the state hook
      setNames(prevNames => ({ ...prevNames, [id]: value }))
    }

    request.onerror = function(event) {
      console.log('[onerror]', request.error)
    }

    request.onupgradeneeded = function(event) {
      const db = event.target.result
      db.createObjectStore('formData', { keyPath: 'id' })
    }
  }

  // partial application to make on change handler easier to deal with
  const handleSetName = id => e => setName(id)(e.target.value)

  // when the form is submitted, prevent the default action
  // which reloads the page and reset the first and last name
  // in both the store and in the state hook
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
        value={names.firstname}
        onChange={handleSetName('firstname')}
      />
      <br />
      <span>Last name:</span>
      <br />
      <input
        style={inputStyle}
        type="text"
        name="lastname"
        value={names.lastname}
        onChange={handleSetName('lastname')}
      />
      <br />
      <Online>
        <input type="submit" value="Submit" />
      </Online>
      <Offline>You are currently offline!</Offline>
    </form>
  )
}

export default Form
