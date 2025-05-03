'use client';
import axios from 'axios'
import React,{useEffect, useState} from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageUser = () => {

const [usersList, setUserList] = useState([]);

    const fetchUsers = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/getall`);
        const data = res.data;
        console.table(data);
        setUserList(data);
    };

    useEffect(() => {
     fetchUsers();
    }, []);

    const deleteUser = async (id) => {
      const res= await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/delete/${id}`);
      toast.success('User deleted successfully!');
      fetchUsers();
    }
    
  return (
    <div>
      <div className='container mx-auto py-10'>
        <h1 className='text-center font-bold text-4xl'>Manage Users</h1>
        <table className='mt-5 w-full'>
          <thead className='border'>
            <tr>
              <th className='p-3'>ID</th>
              <th className='p-3'>Name</th>
              <th className='p-3'>Email</th>
              <th className='p-3'>CreatedAt</th>
            </tr>
          </thead>
          <tbody>
            {
              userList.map( (users) => {
                return <tr key={users._id}>
                  <td className='p-3'>{users._id}</td>
                  <td className='p-3'>{users.name}</td>
                  <td className='p-3'>{users.email}</td>
                  <td className='p-3'>{new Date(users.createdAt).toLocaleDateString()}</td>
                  <td className='p-3'>
                  <button onClick={() => { deleteUser(users._id) }} className='bg-red-500 text-white rounded p-3'>
                    Delete
                    </button>
                    </td>
                </tr>
              })
            }

          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageUser;