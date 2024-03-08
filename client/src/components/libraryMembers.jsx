import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";

const LibraryMembers = ({ setAuth }) => {
    const [staffs, setStaffs] = useState([]);

    let navigate = useNavigate();

    const getInfo = async() => {
        try{
            const staff = await fetch ("http://localhost:5000/getStaffContacts");
            const staffData = await staff.json();
            setStaffs(staffData);
        }catch(err){
            console.error(err.message);
        }
    }

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <Fragment>
            <div className="page-container">
                <h1 className="fixed-header" style={{ backgroundColor: '#5A1917' }}>Library Members</h1>
                <h1 className="text-center mb-5" style={{ color: "white" }}>BIBLIOPHILE</h1>

                <table className="table mt-5">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Shelf Managed</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffs.map((staff) => (
                            <tr key={staff.staff_id} className={`table-row ${staff.selected ? 'selected' : ''}`}>
                                <td>{staff.first_name} {staff.last_name}</td>
                                <td>{staff.shelf_id}</td>
                                <td>{staff.phone_number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </Fragment>
    );
};

export default LibraryMembers;
