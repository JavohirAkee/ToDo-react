import React from 'react'
import Image from '../assets/stacks_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png'
const ToDo = () => {
  return (
    <div className='flex'>
        <div>
            <h1 className=''><img src={Image} alt="" />To-do App</h1>
        </div>
        <div>
            <input type="text" placeholder='Yangi vazifa yozing...' />
            <button>Qo‘shish</button>
        </div>
    </div>
  )
}

export default ToDo