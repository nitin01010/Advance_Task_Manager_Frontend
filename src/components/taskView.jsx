import React, { useEffect, useState } from 'react'
import { handleCreateTask, handleDeleteTask, handleGETAllTask, toggleTaskStatus } from '../../api/taskApi';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FallingLines } from "react-loader-spinner";
import { toast } from 'react-toastify';
import { MdDelete } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import TaskUpdateModal from './taskUpdateModal';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


const TaskView = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ["tasks"],
        queryFn: handleGETAllTask,
    });
    const [showModal, setShowModal] = useState(false);
    const [updateTask, setUpdateTask] = useState();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (data?.data) setTasks(data.data.reverse());
    }, [data]);

    const [input, setInput] = useState({
        task: "",
        completed: ""
    });

    const handleInputChanges = (e) => {
        const { value, name } = e.target;

        setInput((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const { mutate } = useMutation({
        mutationFn: handleCreateTask,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(["tasks"]);
        },
    });


    const handleButton = () => {
        if (!input.task) {
            toast.error("Please Enter task");
            return
        }
        mutate(input);
        setInput({ task: "", completed: "" });
    };

    const { mutate: deleteTask } = useMutation({
        mutationFn: handleDeleteTask,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(["tasks"]);
        },
    });

    const handleDelete = (id) => {
        deleteTask(id);
    };

    const handleUpdate = (id) => {
        setUpdateTask(id)
        setShowModal(true)
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const updatedTasks = Array.from(tasks);
        const [reorderedItem] = updatedTasks.splice(result.source.index, 1);
        updatedTasks.splice(result.destination.index, 0, reorderedItem);
        setTasks(updatedTasks);
    };
    const { mutate: toggleTask } = useMutation({
        mutationFn: toggleTaskStatus,
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries(["tasks"]); // refresh the tasks
        },
        onError: () => {
            toast.error("Failed to update task status");
        },
    });


    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <FallingLines
                    color="#4fa94d"
                    width="100"
                    visible={true}
                    ariaLabel="falling-circles-loading"
                />
            </div>
        );
    }

    if (error) {
        return <div>Error loading tasks: {error.message}</div>;
    }


    return (
        <div className=' w-full rounded-t-lg md:w-[80%] min-h-[600px]  bg-white p-2  sm:p-10  text-black relative '>
            <div className=' flex justify-center items-center gap-4 flex-wrap sm:flex-nowrap'>
                <input name="task" value={input.task} type="text" onChange={(value) => handleInputChanges(value)} placeholder='Add task ....' className=' text-lg border w-full p-3 px-4 outline-none rounded-t-lg border-gray-300 capitalize' />
                <button onClick={handleButton} className=' sm:w-[200px] text-lg w-full text-white font-bold bg-orange-500 h-[60px] rounded-t-lg'>Add</button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="taskList">
                    {(provided) => (
                        <div
                            className='MainConatiner flex flex-col gap-2 mt-4 overflow-scroll h-[600px]'
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {tasks.map((item, index) => (
                                <Draggable key={item._id} draggableId={item._id} index={index}>
                                    {(provided) => (
                                        <div
                                            key={item._id}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className='flex items-center bg-[#f2f2f2] transition-all ease-linear border-b border-gray-300 hover:shadow-md justify-between py-3'
                                        >
                                            <p className='ml-2'>{item.title}</p>
                                            <div className='flex'>

                                                <FaPencilAlt color='orange' size={18} className='mr-2 mt-1' onClick={() => handleUpdate(item)} />
                                                <MdDelete color='orange' size={25} className='mr-2' onClick={() => handleDelete(item._id)} />
                                                <input
                                                    type="checkbox"
                                                    checked={item?.completed}
                                                    className="bg-emerald-400 w-[18px] mr-4 p-1"
                                                    onChange={() => toggleTask(item._id)} 
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {
                showModal && <TaskUpdateModal item={updateTask} setShowModal={setShowModal} />
            }

        </div>
    )
}

export default TaskView