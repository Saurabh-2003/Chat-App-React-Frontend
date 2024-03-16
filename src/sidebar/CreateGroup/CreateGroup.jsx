import React, { useState } from 'react';
import Modal from 'react-modal';
import { Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios'
import {toast} from 'react-hot-toast';



const CreateGroup = ({ user, socket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
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

    const formData = new FormData();
    formData.append('groupName', data.groupName);
    formData.append('participants', JSON.stringify(participants));
    formData.append('admin', user.email);
  
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    };
  
    setLoading(true);
    const loadingId = toast.loading("Creating a group, Please Wait !!")

    try {
      
      const response = await axios.post(process.env.REACT_APP_BACKEND+'/api/new/create-group', formData, config);
      const { success, validEmails, invalidEmails } = response.data; 
      if (!success) toast.error("Some Error Occurred");
      setParticipants([]);
      reset()
      
      toast.success(
        <div>
          {validEmails.length > 0 && 
            <div>
              <h1 className="text-slate-600">Request Sent Successfully to :</h1>
              <ul>
                {validEmails.map((mail, index) => (
                  <li key={index} className="text-sm text-slate-500">
                    {index + 1}) {mail}
                  </li>
                ))}
              </ul>
            </div>
          }
          {invalidEmails.length > 0 && 
            <div className="text-red-500">
              <h1 >Mail not sent to following emails as they are invalid :</h1>
              <ul className="text-red-400">
                {invalidEmails.map((mail, index) => (
                  <li key={index} className="text-sm ">
                    {index + 1}) {mail}
                  </li>
                ))}
              </ul>
            </div>
          }
        </div>
      );
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          toast.error(
              <ul className="text-sm">
                  {errors.map((err, index) => (
                      <li key={index} className="text-red-500">{index + 1}) {err}</li>
                  ))}
              </ul>
          );
      } else {
          toast.error(error.response.data.message);
          setParticipants([])
      }
  } finally {
      setLoading(false);
      toast.dismiss(loadingId)
    }
  };


  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className='bg-indigo-600 h-10 w-10 rounded-full flex items-center justify-center shadow-lg'
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
            disabled={loading}
            className='absolute top-2 disabled:cursor-wait hover:text-red-500 right-2 focus:outline-none'
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
                className='mt-1 p-2 w-full border border-gray-300 disabled:cursor-not-allowed rounded-md focus:outline-none '
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
                  disabled={loading}
                  className='p-2 h-12 flex-grow border disabled:cursor-not-allowed border-gray-300 rounded-l-md focus:outline-none '
                  {...register('participant')}
                />
                <button
                  type='button'
                  disabled={loading}
                  onClick={handleSubmit(handleAddParticipant)}
                  className='px-4 py-2 disabled:cursor-not-allowed bg-indigo-500 h-12 text-white rounded-r-md hover:bg-indigo-600 focus:outline-none'
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
                    disabled={loading}
                      onClick={() => handleRemoveParticipant(index)}
                      className='bg-red-500 disabled:cursor-not-allowed w-4 h-4 rounded-full text-white absolute -top-1 -right-1 focus:outline-none'
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
              className={`w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none ${
                participants.length < 1 ? 'disabled:cursor-not-allowed' : ''
              } ${
                loading ? 'disabled:cursor-progress' : ''
              }`}
              disabled={participants.length < 1 || loading}
            >
              {loading ? 'Creating Group...' : 'Create Group'}
            </button>


          </form>
        </motion.div>
      </Modal>
    </div>
  );
};

export default CreateGroup;
