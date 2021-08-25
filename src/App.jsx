import React, { Component, useEffect, useState } from 'react';
import ToDoBlock from './components/ToDoBlock';
import './main.css'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { notes: [], notePlaceholder: "", openInput: false, formKey: -1 };
  }

  createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  toToDoBlock(string, key) {
    let oldBlock = this.createElementFromHTML(string);
    return <ToDoBlock key={key} done={oldBlock.classList.contains("done")} handleDelete={this.removeNote.bind(this, key)}>{oldBlock.querySelector(".description").innerHTML}</ToDoBlock>
  }

  componentDidMount() {
    window.addEventListener("keyup", (e) => { if (e.keyCode == 13) this.storeNotes(); });
    let savedData = localStorage.getItem("notes");
    if (savedData) {
      let parsed = JSON.parse(savedData);
      let key = Date.now();
      let addNotes = [];
      parsed.forEach(note => {
        addNotes.push(this.toToDoBlock(note, key));
        key += 1;
      })
      this.setState({ notes: [...this.state.notes, ...addNotes] });
    }
  }

  async addNote() {
    await this.setState({ formKey: -1 });
    await this.setState({ notePlaceholder: "" });
    this.toggleInputForm();
  }

  async removeNote(key) {
    let notesClone = [...this.state.notes];
    notesClone = notesClone.filter(note => note.key != key);
    await this.setState({ notes: notesClone });
    this.storeNotes();
  }

  handleTextAreaOnChange(e) {
    this.setState({ notePlaceholder: e.target.value });
  }

  toggleInputForm() {
    this.setState({ openInput: !this.state.openInput });
  }

  async editNote(key) {
    await this.setState({ formKey: key });
    let noteToEdit = [...this.state.notes].filter(note => note.key == key)[0];
    await this.setState({ notePlaceholder: noteToEdit.props.children });
    this.toggleInputForm();
  }

  async formInputDone(multi = false) {
    if (this.state.formKey <= -1) {
      let key = Date.now();
      if (multi) {
        let values = document.querySelector("#new-note-value").value.split('\n');
        let addNotes = [];
        values.forEach(async (value) => {
          addNotes.push(<ToDoBlock key={key} handleDelete={this.removeNote.bind(this, key)} >{value}</ToDoBlock>);
          key += 1;
        });
        await this.setState({ notes: [...this.state.notes, ...addNotes] });
      }
      else {
        await this.setState({ notes: [...this.state.notes, <ToDoBlock key={key} handleDelete={this.removeNote.bind(this, key)} >{document.querySelector("#new-note-value").value}</ToDoBlock>] });
      }
    }
    else {
      let key = this.state.formKey;
      let noteToEdit = [...this.state.notes].filter(note => note.key == key)[0];
      let index = this.state.notes.indexOf(noteToEdit);
      let editedNote = <ToDoBlock key={key} done={noteToEdit.props.done} handleDelete={noteToEdit.props.handleDelete} >{document.querySelector("#new-note-value").value}</ToDoBlock>;
      let notesClone = [...this.state.notes];
      notesClone.splice(index, 1, editedNote);
      await this.setState({ notes: notesClone });
    }
    this.toggleInputForm();
    this.storeNotes();
  }

  async storeNotes() {
    await setTimeout(() => {
      let outerHTMLs = [];
      document.querySelectorAll(".todo-wrapper").forEach(note => {
        outerHTMLs.push(note.outerHTML);
      });
      localStorage.setItem("notes", JSON.stringify(outerHTMLs));
    }, 100);
  }

  renderNotes() {
    if (this.state.notes.length > 0)
      return this.state.notes;
    else
      return (
        <div className="min100vh"><div className="absolute-center"><h3 className="center-text">Liste boş</h3></div></div>
      )
  }

  render() {
    return (
      <div className="content" onClick={this.storeNotes.bind(this)}>
        <div className="add-button" onClick={this.addNote.bind(this)}><span>+</span></div>
        <div className={!this.state.openInput ? "todo-form hidden" : "todo-form"}>
          <div className="absolute-center boxed center-text">
            <h2>Açıklama Girin</h2>
            <form>
              <textarea id="new-note-value" required={true} value={this.state.notePlaceholder} onChange={(e) => this.handleTextAreaOnChange(e)}></textarea>
              <br></br>
              <center className="center-text"><label>Her satırı ayrı bir kayıt yap<input id="seperate-lines" type="checkbox"></input></label></center>
              <div className="center-text">
                <a onClick={() => this.toggleInputForm()} className="button red">İptal</a>
                <a onClick={() => {
                  let form = document.querySelector("form");
                  if (!form.checkValidity()) {
                    form.querySelector(".hidden-submit").click();
                  }
                  else {
                    this.formInputDone(document.querySelector("#seperate-lines").checked);
                  }
                }} className="button">Onayla</a>
                <input className="hidden-submit" type="submit" style={{ display: "none" }}></input>
              </div>
            </form>
          </div>
        </div>
        <div className="rendered-notes">
          {this.renderNotes()}
        </div>
      </div>
    );
  }
}

export default App;