import React, { useState, useEffect } from 'react'
import { Offline, Online } from 'react-detect-offline'

const inputStyle = { margin: '1rem 0rem' }

const Form = ({ db }) => {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')

  const setName = id => value => {
    // update the database
    db.formData.put({ id, value })
    // update the internal state
    if (id === 'firstname') setFirstname(value)
    if (id === 'lastname') setLastname(value)
  }

  const handleSetName = id => e => setName(id)(e.target.value)

  // set firstname and lastname to whatever is in the database
  // if no values are in the database, set the database values to ''
  useEffect(() => {
    db.version(1).stores({ formData: 'id,value' })

    db.transaction('rw', db.formData, async () => {
      // if the first or last name fields have not be added, add them
      const dbFirstname = await db.formData.get('firstname')
      const dbLastname = await db.formData.get('lastname')
      if (!dbFirstname) {
        await db.formData.add({ id: 'firstname', value: '' })
      } else {
        setFirstname(dbFirstname.value)
      }
      if (!dbLastname) {
        await db.formData.add({ id: 'lastname', value: '' })
      } else {
        setLastname(dbLastname.value)
      }
    }).catch(e => {
      console.log(e.stack || e)
    })

    // close the database connection if form is unmounted
    return () => db.close()
  }, [])

  // when the form is submitted, prevent the default action
  // which reloads the page and reset the first and last name
  const handleSubmit = e => {
    e.preventDefault()
    setName('firstname')('')
    setName('lastname')('')
  }

  console.log('render')

  return (
    <form style={{ padding: '2rem 0rem' }} onSubmit={handleSubmit}>
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
