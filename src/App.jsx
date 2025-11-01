import React, { useState } from 'react'
import TaskView from './components/taskView'
import { FaToggleOff } from "react-icons/fa";
import { FaToggleOn } from "react-icons/fa";

const App = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <div className={`p-2 flex-col  flex justify-center transition-all ease-linear items-center ${!toggle ? 'bg-[#f2f2f2]' : ' bg-black'}  text-black h-screen  `}>
      <div className=' flex  justify-end w-full '>
        {
          !toggle ? <FaToggleOff size={40} onClick={() => setToggle(!toggle)} /> : <FaToggleOn size={40} fill='white' onClick={() => setToggle(!toggle)} />
        }
      </div>
      <h1 className={` ${!toggle ? 'text-black' : ' text-white'} text-2xl sm:text-3xl capitalize mb-4 font-bold py-4`}><b>Advanced Task Manager App</b></h1>
      <TaskView />
    </div>
  )
}

export default App