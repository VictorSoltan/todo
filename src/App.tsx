import React, { useState, useEffect } from 'react';
import './App.css';

import { Header } from './components/Header'
import { TodoItems } from './components/TodoItems'

import { Routes, Route } from 'react-router-dom'

import axios from 'axios'

function App() {

  const 
    [todoList, setTodoList] = useState<Array<{title: string, description: string, completed: boolean, dateTime: string, id: string}>>([]),
    [searchResults, setSearchResults] = useState<Array<{title: string, description: string, completed: boolean, dateTime: string, id: string}>>([]),

    api_address = 'https://6370b4f70399d1995d82407c.mockapi.io/todo/'

  useEffect(() => {
    axios.get(api_address)
    .then(res => {
      res.data.reverse()
      setTodoList(res.data)
      setSearchResults(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <div className="App">
      <div className='todo_app'>Todo App</div>
      <div className='todo_app_container'>
        <Header 
        api_address={api_address} todoList={todoList} setTodoList={setTodoList} 
        searchResults={searchResults} setSearchResults={setSearchResults} />

        <Routes>
          {['/todo/', '/completed', '/uncompleted'].map((item, index) => (
            <Route path={item} key={index} element={
              <TodoItems api_address={api_address} 
                todoList={todoList} setTodoList={setTodoList}
                searchResults={searchResults} setSearchResults={setSearchResults} />
            } />
          ))}

        </Routes>
      </div>
    </div>
  );
}

export default App;
