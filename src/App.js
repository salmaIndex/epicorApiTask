import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function FetchData() {
  const [data, setData] = useState(null);
  const [search , setSearch]=useState('');
  const [editingPart, setEditingPart]=useState(null)
  const [editingPartCompany, setEditingPartCompany]=useState(null)
  const apilink = 'https://77.92.189.102/iit_vertical_precast/api/v1/Erp.BO.PartSvc/Parts';
  const username = 'manager';
  const password = 'manager';
  const basicAuth = 'Basic ' + btoa(username + ':' + password);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apilink, {
          headers: {
            Authorization: basicAuth
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
 
    fetchData();
  }, [apilink, basicAuth]);

console.log(search);

const toggleEditMode = (partId ,Company) => {
  if (editingPart === partId) {
    setEditingPart(null); // Disable edit mode
    
  } else {
    setEditingPart(partId); // Enable edit mode for the specified part
    setEditingPartCompany(Company);
  }
};
const updatePartDescription = async (partId, newDescription ,Company) => {
  try {
    const response = await axios.patch(`${apilink}/('${Company}','${partId}')`, {
      PartDescription: newDescription
    }, {
      headers: {
        Authorization: basicAuth
      }
    });
    // Update the local state to reflect the changes
    setData(data.map(part => part.PartNum === partId ? { ...part, PartDescription: newDescription } : part));
    setEditingPart(null); // Disable edit mode after updating
  } catch (error) {
    console.error('Error updating part description:', error);
  }
};


  return (

  
    <div className='  mt-5'>
   
    
      <form className='w-50 m-auto'><label className='my-2 text-start'>Search By PartNum:</label>
      <input placeholder='Search Here' className='form-control' type='search' onChange={(e) => setSearch(e.target.value)}></input></form>
      
      {data ? (
        <table className="table table-striped my-3 text-center   table-hover" >
        <thead>
            <tr>
            <th >company</th>
              <th>Part Num</th>
              <th>Part Description</th>
              <th>IUM</th>
              <th>Update</th>
            </tr>
            </thead>
            <tbody>

            {data.value.filter((item)=>
            {
              return search.toLocaleLowerCase()===''
              ?item
              :item.PartNum.toLocaleLowerCase().includes(search);
            }).map((item) => (
            <tr key={item.PartNum}>
              <td>{item.Company}</td>
              <td>{item.PartNum}</td>
              <td>
                {editingPart === item.PartNum ? (
                  <input
                    type="text"
                    defaultValue={item.PartDescription}
                    onBlur={(e) => updatePartDescription(item.PartNum, e.target.value , item.Company)}
                  />
                ) : (
                  item.PartDescription
                )}
              </td>
              <td>{item.IUM}</td>
              <td>
                <button onClick={() => toggleEditMode(item.PartNum,item.Company) } className='btn btn-warning'>
                  {editingPart === item.PartNum ? 'Save' : 'Edit'}
                </button>
              </td>
            </tr>
          ))}


          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
  
}
 
export default FetchData;