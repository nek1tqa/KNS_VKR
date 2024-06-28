// import React from 'react';
// // import LessonRow from "./LessonRow";
//
// const Table = (props) => {
//
//     console.log(props.lessonRowsData);
//
//     const lessonRowsData = props.lessonRowsData;
//     const tableWidth = props.width;
//
//     const header = [];
//     for(let i = 0; i < tableWidth; i++)
//         header.push(<th key={i} style={{minWidth: "30ch", maxWidth: "30ch"}}>{i}</th>);
//
//
//     return (
//
//         <table>
//             <thead>
//                 <tr>
//                     {header}
//                 </tr>
//             </thead>
//             <tbody>
//             {
//
//                 lessonRowsData.map((lessonRow, index) => {
//                     return <LessonRow key={index} cells={lessonRow} />
//                 })
//
//
//             }
//             </tbody>
//         </table>
//
//     );
//
// };
//
// export default Table;