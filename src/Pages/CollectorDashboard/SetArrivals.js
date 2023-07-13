import React, { useState, Fragment, useEffect } from "react";
import "./UpdateForm.css";
import Navbar from "../../Components/Navbar/Navbar";
import moment from "moment";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
//import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
//import InputGroup from "react-bootstrap/InputGroup";
//import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import FormGroup from "react-bootstrap/esm/FormGroup";
import MaskedFormControl from "react-bootstrap-maskedinput";
import axios from "axios";
import "./SetArrivalscss.css";
//import data from "./mock-data.json"
import ReadOnlyRow from "../../Components/ReadOnlyRow";
import EditableRow from "../../Components/EditableRow";

export const SetArrivals = () => {
  const [currentDay, setCurrentDay] = useState(""); // Get the current day
  const [contacts, setContacts] = useState(new Array(0));
  const [addFormData, setAddFormData] = useState({
    collectionpointname: "",
    collectionpoint: "",
    arrivaltime: "",
    day: "",
  });

  useEffect(() => {
    // Get the current day when the component mounts
    const day = moment().format("dddd");
    setCurrentDay(day);
  }, []);

  const [editFormData, setEditFormData] = useState({
    collectionpointname: "",
    collectionpoint: "",
    arrivaltime: "",
    day: "",
  });

  const [editContactId, setEditContactId] = useState(null);
  const [response, setResponse] = useState();

  const handleAddFormChange = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);

    console.log(newFormData);
    event.preventDefault();
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    //console.log(addFormData);
    event.preventDefault();

    const newContact = {
      collectionpointname: addFormData.collectionpointname,
      collectionpoint: addFormData.collectionpoint,
      arrivaltime: addFormData.arrivaltime,
      day: currentDay,
    };

    console.log(newContact);

    axios
      .post("http://127.0.0.1:8000/setarrivals/", newContact)
      .then((res) => {
        console.log(res.data)
        setResponse(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    const newContacts = [...contacts, newContact];
    setContacts(newContacts);

    setAddFormData({
      collectionpointname: "",
      collectionpoint: "",
      arrivaltime: "",
      day: "", // Clear the 'day' property
    });
  };

  const handleEditformSubmit = (event) => {
    event.preventDefault();

    const editedContact = {
      id: editContactId,
      collectionpointname: editFormData.collectionpointname,
      collectionpoint: editFormData.collectionpoint,
      arrivaltime: editFormData.arrivaltime,
      day: editFormData.day,
    };
    const newContacts = [...contacts];
    const index = contacts.findIndex((contact) => contact.id === editContactId);
    newContacts[index] = editedContact;
    setContacts(newContacts);
    setEditContactId(null);
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.id);

    const formValues = {
      collectionpointname: contact.collectionpointname,
      collectionpoint: contact.collectionpoint,
      arrivaltime: contact.arrivaltime,
      day: contact.day,
    };
    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleDeleteClick = (contactId) => {
    const newContacts = [...contacts];

    const index = contacts.findIndex((contact) => contact.id === contactId);
    newContacts.splice(index, 1);
    axios
      .delete(`http://127.0.0.1:8000/setarrivals/delete/${contactId}`)
      .then((res) => {
        console.log(res.data)
        setContacts(newContacts);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/setarrivals/").then((res) => {
      console.log(res.data);
      setContacts(res.data);
    });
  }, [response]);

  return (
    <div className="form">
      <div>
        <Navbar />
      </div>
      <div>
        <div className="div1">
          <h1>Set Arrivals by collector</h1>
        </div>
        <div>Current Day: {currentDay}</div>

        <div className="addCollectionPoint">
          <h2>Add a collection point</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="collectionpointname"
              required
              placeholder="enter"
              onChange={handleAddFormChange}
            />
            <input
              type="number"
              name="collectionpoint"
              required
              placeholder="enter cp"
              onChange={handleAddFormChange}
            />

            <input
              type="time"
              name="arrivaltime"
              required
              placeholder="enter time"
              onChange={handleAddFormChange}
            />
            <button type="submit">Add</button>
          </form>
        </div>

        <div className="app-container">
          <form onSubmit={handleEditformSubmit}>
            <table>
              <thead>
                <tr>
                  <th>collectionpointname</th>
                  <th>collectionpoint</th>
                  <th>arrivaltime</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts
                  .filter((contact) => contact.day === currentDay)
                  .map((contact,index) => (
                    <React.Fragment key={index}>
                      {editContactId === contact.id ? (
                        <EditableRow
                          editFormData={editFormData}
                          handleEditFormChange={handleEditFormChange}
                          handleCancelClick={handleCancelClick}
                        />
                      ) : (
                        <ReadOnlyRow
                          contact={contact}
                          handleEditClick={handleEditClick}
                          handleDeleteClick={handleDeleteClick}
                        />
                      )}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetArrivals;
