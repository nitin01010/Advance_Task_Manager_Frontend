import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { handleUpdateTask } from '../../api/taskApi';
import { toast } from 'react-toastify';

const TaskUpdateModal = ({ item, setShowModal }) => {
    const { title, _id } = item;
    const [task, setTask] = useState(title);
    const queryClient = useQueryClient();

    const { mutate: updateTask, isLoading } = useMutation({
        mutationFn: handleUpdateTask,
        onSuccess: () => {
            toast.success("Task updated successfully!");
            queryClient.invalidateQueries(["tasks"]);
            setShowModal(false);
        },
        onError: () => {
            toast.error("Failed to update task");
        }
    });

    const handleButton = () => {
        if (!task.trim()) {
            toast.error("Please enter a task");
            return;
        }
        updateTask({ id: _id, title: task });
    };

    return (
        <div className='fixed inset-0 z-50 w-[77%] m-auto top-27 text-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-100 p-4 '>

            <div className='p-1 flex justify-end w-full mr-4 cursor-pointer'>
                <IoMdClose onClick={() => setShowModal(false)} size={30} className='mb-4' color='black' />
            </div>

            <div className='flex justify-center items-center gap-4 flex-wrap sm:flex-nowrap'>
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder='Add task ....'
                    className='text-lg border w-full p-3 px-4 outline-none rounded-t-lg bg-white border-gray-300 capitalize'
                />
                <button
                    onClick={handleButton}
                    className='sm:w-[200px] text-lg w-full text-white font-bold bg-purple-500 h-[60px] rounded-t-lg'
                    disabled={isLoading}
                >
                    {isLoading ? "Updating..." : "Update"}
                </button>
            </div>
        </div>
    );
};

export default TaskUpdateModal;
