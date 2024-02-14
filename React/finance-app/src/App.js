import React, {useEffect, useState} from 'react';
import api from './api'

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData,setFormData] = useState({
    amount : '',
    category:'',
    description: '',
    is_income: false,
    date: ''
  });

  const fetchTransaction = async () => {
    const response = await api.get('/transactions');
    setTransactions(response.data)
  };

  useEffect(() => {
    fetchTransaction();
  },[]);

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,[event.target.name] : value
    })
  }
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await api.post('/transactions/',formData);
    fetchTransaction();
    setFormData({
      amount : '',
      category:'',
      description: '',
      is_income: false,
      date: ''
    });
  }

  return (
<div>
  <nav className='navbar navbar-dark bg-primary'>
    <div className='container-fluid'>
      <a className='navbar-brand' href='#'>
        Finance App
      </a>
    </div>
  </nav>
</div>
  )
}
export default App;
