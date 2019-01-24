import React, { useState } from 'react'
import Dexie from 'dexie'

import Form from './Form'

const App = () => {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ margin: '2rem auto', width: '200px' }}>
      <button onClick={() => setOpen(!open)}>{`${
        open ? 'Close' : 'Open'
      } Form`}</button>
      {/* Pass in a new connection to the database when Form is first rendered */}
      {open && <Form db={new Dexie('FormDatabase')} />}
    </div>
  )
}

export default App
