import React, { useState, useEffect } from "react";
import axios from 'axios';
import { XCircle, X } from "lucide-react";
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

function GroupSettingsModal({ isOpen, onRequestClose, user, selectedFriend }) {
  const [groupInfo, setGroupInfo] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/new/getmyinfo/${selectedFriend}`);
        setGroupInfo(res.data.info);
      } catch (error) {
        console.error("Error fetching group info:", error);
      }
    };
    if (isOpen && selectedFriend) {
      fetchGroupInfo();
    }
  }, [isOpen, selectedFriend]);

  const removeExistingParticiapent = async (participantId) => {
    try {
      const groupId = groupInfo._id;
      const url = `${process.env.REACT_APP_BACKEND}/api/new/remove-group-participant?participantId=${participantId}&groupId=${groupId}`;
      await axios.delete(url);
      
      const updatedFriends = groupInfo.friends.filter(member => member._id !== participantId);
      setGroupInfo(prevState => ({
        ...prevState,
        friends: updatedFriends
      }));
      toast.success("Participant removed successfully.");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  

const handleAddParticipant = (data) => {
  const { participant } = data;
  if (participant.trim() !== '') {
    const isParticipantInGroup = groupInfo.friends.some(member => member.email === participant);
    const isAdmin = participant === user.email;

    if (isParticipantInGroup) {
      toast.error("User already present in the group");
    } else if (isAdmin) {
      toast.error("You cannot add yourself as a participant");
    } else if (participants.includes(participant)) {
      toast.error("Duplicate email entered");
    } else {
      setParticipants([...participants, participant]);
     
    }
    reset({ participant: '' });
  }
};  

  const handleRemoveParticipant = (index) => {
    const updatedParticipants = [...participants];
    updatedParticipants.splice(index, 1);
    setParticipants(updatedParticipants);
  };

  const addNewMembers = async () => {
    if (participants.length < 1) return;
  
    setLoading(true);
    const formData = new FormData();
    formData.append('groupId', groupInfo._id);
    formData.append('participants', JSON.stringify(participants));
    formData.append('admin', user.email);
  
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    };
  
    try {
      const response = await axios.put(process.env.REACT_APP_BACKEND + '/api/new/update-group', formData, config);
      const { success, message, validEmails, invalidEmails } = response.data; 
      if (!success) toast.error("Some Error Occurred");
      setParticipants([]);
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
    } 
    catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg max-w-md p-6 shadow-xl min-w-2/4 min-h-96 max-h-4/5 overflow-hidden">
        <h2 className="text-center text-2xl mb-6 font-bold">Group Settings</h2>
        {groupInfo && (
          <div className="h-64 overflow-y-auto">
            <h3 className="mb-4 text-lg font-semibold">Group Members</h3>
            <ul className="space-y-4">
              {groupInfo.friends.map((member) => (
                <li key={member._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-md">
                  <div className="flex items-center gap-4">
                    <img className="h-12 w-12 rounded-full" src={member.image || "/placeholder.jpg"} alt="Member" />
                    <div>
                      <div className="text-lg font-semibold">{member.name}</div>
                      <div className="text-gray-500">{member.email}</div>
                    </div>
                  </div>
                  <div>
                    {member._id === groupInfo.admin && <span className="text-sm text-blue-600">(Admin)</span>}
                    {member._id === user._id && <span className="text-sm text-green-600">(You)</span>}
                  </div>
                  {user._id === groupInfo.admin && member._id !== groupInfo.admin && (
                    <button onClick={() => removeExistingParticiapent(member._id)} className="text-red-500 hover:underline">Remove</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {groupInfo && groupInfo.admin.toString() === user._id.toString() && (
          <div className="pt-2 mt-2 border-t ">
            <h3 className="mb-4 text-lg font-semibold">Add Member</h3>
            <form onSubmit={handleSubmit(addNewMembers)}>
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
                {participants.length < 1 && <p className='text-red-500 text-sm mt-1'> Add atleast one new member</p>}
              </div>
              <button
                type="submit"
                className={`w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none ${participants.length < 1 ? 'cursor-not-allowed' : ''}`}
                disabled={participants.length < 1}
              >
                Add Particiapents
              </button>
            </form>
          </div>
        )}
        <button onClick={onRequestClose} className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full">
          <XCircle className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default GroupSettingsModal;
