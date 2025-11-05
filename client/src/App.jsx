import { useState } from 'react'
import ItemForm from './components/ItemForm.jsx'
import ItemList from './components/ItemList.jsx'
import './App.css'

function App() {

  return (
    <div>
      <ItemForm />
      <ItemList />
    </div>
  )
}

export default App
