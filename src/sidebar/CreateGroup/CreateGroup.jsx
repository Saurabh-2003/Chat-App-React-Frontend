import React, { useState } from 'react';
import Modal from 'react-modal';
import { Plus, X } from 'lucide-react';
import { motion, useDragControls } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios'

const CreateGroup = ({ user, socket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const controls = useDragControls()
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    reset();
    setParticipants([]);
  };

  const handleAddParticipant = (data) => {
    const { participant } = data;
    if (participant.trim() !== '') {
      setParticipants([...participants, participant]);
      // Reset the participant field after adding
      reset({ participant: '' });
    }
  };

  const handleRemoveParticipant = (index) => {
    const updatedParticipants = [...participants];
    updatedParticipants.splice(index, 1);
    setParticipants(updatedParticipants);
  };

  const handleCreateGroup = async (data) => {
    if (participants.length < 1) return;
  
    setLoading(true);
    const formData = new FormData();
    formData.append('groupName', data.groupName);
    formData.append('participants', JSON.stringify(participants));
    formData.append('admin', user.email);
  
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    };
  
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND+'/api/new/create-group', formData, config);
      console.log(response.data);
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
      closeModal(); 
    }
  };


  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className='bg-bg-primary/90 hover:bg-bg-primary active:bg-blue-700 h-12 w-12 rounded-full flex items-center justify-center shadow-lg'
        onClick={openModal}
        title="Create a group"
      >
        <Plus size={24} className='text-white' />
      </motion.button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Create Group Modal"
        className={`bg-white/20 backdrop-blur-sm grid place-items-center w-full h-full`}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className='relative bg-white shadow-lg w-96 px-10 py-6 rounded-xl'
        >
          <h2 className='text-xl w-full text-center font-bold mb-4'>Create Group</h2>
          <motion.button
            whileHover={{ scale: 1.2 }}
            onClick={closeModal}
            className='absolute top-2 hover:text-red-500 right-2 focus:outline-none'
          >
            <X size={24} />
          </motion.button>
          <form onSubmit={handleSubmit(handleCreateGroup)}>
            <div className='mb-4'>
              <label htmlFor='groupName' className='block text-sm font-medium text-gray-700'>Group Name</label>
              <input
                type='text'
                id='groupName'
                name='groupName'
                disabled={loading}
                {...register('groupName', { required: 'Group Name is required' })}
                className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none '
              />
              {errors.groupName && <p className='text-red-500 text-sm mt-1'>{errors.groupName.message}</p>}
            </div>
            <div className='mb-4'>
              <label htmlFor='participant' className='block text-sm font-medium text-gray-700'>Participants' Email</label>
              <div className='flex items-center mt-1 '>
                <input
                  type='email'
                  id='participant'
                  name='participant'
                  className='p-2 h-12 flex-grow border border-gray-300 rounded-l-md focus:outline-none '
                  {...register('participant')}
                />
                <button
                  type='button'
                  onClick={handleSubmit(handleAddParticipant)}
                  className='px-4 py-2 bg-indigo-500 h-12 text-white rounded-r-md hover:bg-indigo-600 focus:outline-none'
                >
                  Add
                </button>
              </div>
            </div>
            <div className='mb-4'>
              <p className='block text-sm font-medium text-gray-700 mb-1'>Participants</p>
              <ul className='flex flex-wrap w-full gap-x-3 gap-y-3'>
                {participants.map((participant, index) => (
                  <li key={index} className='relative flex items-center'>
                    <div className='px-2 rounded-full text-slate-700 bg-gray-100 '>{participant}</div>
                    <button
                      onClick={() => handleRemoveParticipant(index)}
                      className='bg-red-500 w-4 h-4 rounded-full text-white absolute -top-1 -right-1 focus:outline-none'
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
              {participants.length < 1 && <p className='text-red-500 text-sm mt-1'>At least one member is required to create a group</p>}
            </div>
            <button
              type="submit"
              className={`w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none ${participants.length < 1 ? 'cursor-not-allowed' : ''}`}
              disabled={participants.length < 1}
            >
              Create Group
            </button>
          </form>
        </motion.div>
      </Modal>
    </div>
  );
};

export default CreateGroup;
