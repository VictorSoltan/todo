import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import '../styles/Header.scss'

interface HeaderProps {
    api_address: string;
    todoList: Array<{title: string, description: string, completed: boolean, dateTime: string, id: string}>;
    setTodoList: React.Dispatch<React.SetStateAction<any[]>>;
    searchResults: Array<{title: string, description: string, completed: boolean, dateTime: string, id: string}>; 
    setSearchResults: React.Dispatch<React.SetStateAction<any[]>>;    
}

type UserSubmitForm = {
    title: string;
    description: string;
  };
  


export const Header: React.FC<HeaderProps> = (
    { api_address, todoList, setTodoList, searchResults, setSearchResults }
    ) => {
        const schema = yup.object().shape({
            title: yup.string().required('Title required').max(24, 'Max. 24 symbols'),
            description: yup.string().required('Description required'),
          }).required();
       
          const {
            register,
            handleSubmit,
            formState: { errors }
          } = useForm<UserSubmitForm>({
            resolver: yupResolver(schema)
          });

    function addTodo(title: string, description: string){

	    let
            today = new Date(),
            date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
            time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
            dateTime = date+' '+time;

            axios.post(`${api_address}`, {title: title, description: description, dateTime: dateTime, completed: false})
            .then(res => {
                console.log(res.data)
                setTodoList([res.data, ...todoList])
                setSearchResults([res.data, ...searchResults])
            })
            .catch(err => {
              throw new Error(err)
            })
    }

    return(
        <div className='todo_header'>
            <form onSubmit={handleSubmit((data) => addTodo(data.title, data.description))}>
                <div>
                    <input placeholder='title' {...register('title')} />
                    <p>{errors.title?.message}</p>
                </div>
                <div>
                    <input placeholder='description' {...register('description')} />
                    <p>{errors.description?.message}</p>
                </div>
                <button type="submit">Add todo</button>
            </form>
        </div>
    )
}