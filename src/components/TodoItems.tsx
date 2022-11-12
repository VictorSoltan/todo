import React from 'react';

import Vector from '../assets/Vector.svg'
import Remove from '../assets/delete.svg'

import axios from 'axios'

import { useNavigate, useLocation } from 'react-router-dom'

import '../styles/TodoItems.scss'

interface TodoItemsProps {
    api_address: string;
    todoList: Array<{title: string, description: string, completed: boolean, dateTime: string, id: string}>;
    setTodoList: React.Dispatch<React.SetStateAction<any[]>>;
    searchResults: Array<{title: string, description: string, completed: boolean, dateTime: string, id: string}>; 
    setSearchResults: React.Dispatch<React.SetStateAction<any[]>>;
}



export const TodoItems: React.FC<TodoItemsProps> = (
    { api_address, todoList, setTodoList, searchResults, setSearchResults }
    ) => {
    
    const 
        filterValues = [{name: 'All', value: '/todo/' }, {name: 'Completed', value: '/completed'}, {name: 'Uncompleted', value: '/uncompleted'}],
        navigate = useNavigate(),
        location = useLocation(),
        handleSubmit = (e: any) => e.preventDefault(),

        handleSearchChange = (e: any) => {
            if (!e.target.value) return setSearchResults(todoList)

            const resultsArray = todoList.filter(post => post.title.includes(e.target.value) || post.description.includes(e.target.value))

            setSearchResults(resultsArray)
        } 

    function complete(index: number){
        let newArr = [...todoList]
        
        newArr[index].completed = !newArr[index].completed
        console.log(todoList[index])
        axios.put(`${api_address}${newArr[index].id}`, newArr[index])
        .then(res => {
            console.log(res.data)
            setTodoList(newArr)
            setSearchResults(newArr)
        })
        .catch(err => {
            throw new Error(err)
        })       
    }

    function deleteTodo(index: number){
        console.log(`${api_address}${todoList[index].id}`)
        axios.delete(`${api_address}${todoList[index].id}`)
        .then(res => {
        
            console.log(res.data)

            setTodoList([
                ...todoList.slice(0, index),
                ...todoList.slice(index + 1)
            ]);
            setSearchResults([
                ...todoList.slice(0, index),
                ...todoList.slice(index + 1)
            ])

        })
        .catch(err => {
          throw new Error(err)
        })        
    }

    const todoItem = (item: {id: string; title: string; description: string; dateTime: string; completed: boolean}, index: number) =>{
        return(
            <div key={item.id} className='todo_container'>
                <span onClick={() => complete(index)}  className={item.completed ? 'radio active' : 'radio'} >
                    {item.completed  && <img src={Vector} alt="vector" />}
                </span>                       
                <div className='info'>
                    <h3>{item.title}</h3>
                    <span>{item.dateTime}</span>
                </div>
                <p>{item.description}</p>

                <button onClick={() => deleteTodo(index)} >
                    <img src={Remove} alt="remove" />
                </button>
            </div>            
        )
    }

    return(
        <div className='todo_items'>
            <header>
                {filterValues.map((item, index) => (
                    <div key={index}>
                        <label>{item.name}</label>
                        <span onClick={() => navigate(item.value)}  className={item.value === location.pathname ? 'radio active' : 'radio'} >
                            {item.value === location.pathname  && <img src={Vector} alt="vector" />}
                        </span>            
                    </div>
                ))}
            </header>
            <form className='search' onSubmit={handleSubmit}>
                <input placeholder='search...'  onChange={handleSearchChange} />
            </form>
            {searchResults.map((item, index) => (
                location.pathname === '/todo/' ? todoItem(item, index)
                : location.pathname === '/completed'&&item.completed ? todoItem(item, index)
                : location.pathname === '/uncompleted'&&!item.completed && todoItem(item, index)
            ))}
        </div>
    )
}