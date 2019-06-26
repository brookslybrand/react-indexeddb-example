import React, { useEffect, useState } from 'react'
import { Offline, Online } from 'react-detect-offline'

// some inline styling so everything isn't squished
const formStyle = { padding: '2rem 0rem' }
const inputStyle = { margin: '1rem 0rem' }

// a simple form with a first name, last name, and submit button
const Form = ({ db }) => {
  // store form values in a state hook
  const [names, setNames] = useState({ firstname: '', lastname: '' })

  // set firstname and lastname to whatever is in the database
  // if no values are in the database, set the database values to ''
  useEffect(
    () => {
      // create the store
      db.version(1).stores({ formData: 'id,value' })

      // perform a read/write transatiction on the new store
      db.transaction('rw', db.formData, async () => {
        // get the first and last name from the data
        const dbFirstname = await db.formData.get('firstname')
        const dbLastname = await db.formData.get('lastname')

        // if the first or last name fields have not be added, add them
        if (!dbFirstname) await db.formData.add({ id: 'firstname', value: '' })
        if (!dbLastname) await db.formData.add({ id: 'lastname', value: '' })

        // set the initial values
        setNames({
          firstname: dbFirstname ? dbFirstname.value : '',
          lastname: dbLastname ? dbLastname.value : ''
        })
      }).catch(e => {
        // log any errors
        console.log(e.stack || e)
      })

      // close the database connection if form is unmounted or the
      // database connection changes
      return () => db.close()
    },
    // run effect whenever the database connection changes
    [db]
  )

  // sets the name in the store and in the state hook
  const setName = id => value => {
    // update the store
    db.formData.put({ id, value })
    // update the state hook
    setNames(prevNames => ({ ...prevNames, [id]: value }))
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
      {/* Handle whether or not the user is offline */}
      <Online>
        <input type="submit" value="Submit" />
      </Online>
      <Offline>You are currently offline!</Offline>
    </form>
  )
}

export default Form
