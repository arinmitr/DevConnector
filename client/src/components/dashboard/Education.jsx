import React from 'react'
import { connect } from 'react-redux'
import formatDate from '../../utils/formatDate'
import { deleteEducation } from '../../actions/profile'
const Education = ({education, deleteEducation}) => {
    const educations = education.map(edu => (
        <tr key={edu._id}>
            <td>{edu.institution}</td>
            <td className='hide-sm'>{edu.degree}</td>
            <td className='hide-sm'>{edu.fieldofstudy}</td>
            <td>
                {formatDate(edu.from)} - {edu.to ? formatDate(edu.to) : ' Present'}
            </td>
            <td>
                <button className='btn btn-danger' onClick={() => deleteEducation(edu._id)}>Delete</button>
            </td>
        </tr>
    ))
    return (
        <>
           <h2 className="my-2">Education Credentials</h2> 
           {education.length > 0 ? <table className="table">
               <thead>
                    <tr>
                        <th>Institution</th>
                        <th className="hide-sm">Degree</th>
                        <th className="hide-sm">Field Of Study</th>
                        <th className="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{educations}</tbody>
           </table> : <h3>No education added</h3>}
        </>
    )
}

export default connect(null, {deleteEducation})(Education)
