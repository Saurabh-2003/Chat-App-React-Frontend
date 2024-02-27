function AddFriendForm({ addFriend, onAddFriendChange, onAddFriendSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    onAddFriendSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="add-friend-form flex flex-col space-y-2"
    >
      <input
        type="email"
        name="addFriend"
        placeholder="Enter an Email to send Request"
        value={addFriend}
        onChange={onAddFriendChange}
        className="bg-gray-100 border text-slate-700 border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 transition duration-300"
      />
      <button
        type="submit"
        className="bg-indigo-500 text-white px-6 py-1 rounded-md hover:bg-bg-primary transition duration-300"
      >
        Send Request
      </button>
    </form>
  );
}

export default AddFriendForm;
