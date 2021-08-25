import React, { useEffect, useState } from 'react';
import tick from "../check.svg";
import pencil from "../pencil.svg";
import trash from "../trash.svg";

function ToDoBlock(props) {

    const [done, setDone] = useState(props.done);
    const [text, setText] = useState(props.children);
    const [editMode, setEditMode] = useState(false);
    const [keysDown, setKeysDown] = useState([]);

    function toggleDone() {
        setDone(!done);
    }

    async function addKey(e){
        if(keysDown.indexOf(e.keyCode) == -1)
            await setKeysDown([...keysDown, e.keyCode]);
    }

    async function removeKey(e){
        let copy = [...keysDown];
        copy.splice(copy.indexOf(e.keyCode),1);
        await setKeysDown(copy);
    }

    useEffect( ()=>{
        if(keysDown.includes(13) && keysDown.length == 1)
        {
            let copy = [...keysDown];
            copy.splice(copy.indexOf(13),1);
            setKeysDown(copy);
            toggleEditMode();
        }
    } );

    function renderDescription(){
        if(editMode)
        {
            return(
                <textarea className="edit-text" value={text} onKeyDown={addKey} onKeyUp={removeKey} onChange={(e)=>{setText(e.target.value)}}></textarea>
            )
        }
        else
            return(
                <div className="description">{text}</div>
            )
    }

    function toggleEditMode(){
        setEditMode(!editMode);
    }

    function handleEdit(){
        toggleEditMode();
    }

    return (
        <div className={done ? "todo-wrapper done" : "todo-wrapper"}>
            <div className="float-right">
                <div className="action-icon done-toggler" onClick={toggleDone}>
                    <img src={tick} alt="tick icon" />
                </div>
                <div className="action-icon">
                    <img src={pencil} onClick={handleEdit}></img>
                </div>
                <div className="action-icon">
                    <img src={trash} onClick={props.handleDelete}></img>
                </div>
            </div>
            {renderDescription()}
        </div>
    );
}

ToDoBlock.defaultProps = {
    done: false,
    children: "",
    handleDelete: () => { }
}

export default ToDoBlock;