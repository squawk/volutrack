import React, { Component } from 'react';
import GuestList from './components/GuestList';

class App extends Component {

  state = {
    guests: [
      {
        name: 'Treasure',
        isConfirmed: false
      },
      {
        name: 'Nic',
        isConfirmed: true
      }
    ],
    value: '',
    hideUnconfirmed: false,
    editingIndex: null
  };

  getTotalInvited = () => this.state.guests.length;

  getAttendingGuests = () =>
    this.state.guests.filter(guest => guest.isConfirmed).length;

  getUnconfirmedGuests = () =>
    this.state.guests.filter(guest => !guest.isConfirmed).length;

  handleSubmit = (e) => {
    e.preventDefault();
    const name = this.state.value.trim();
    if (name) {
      this.setState({
        guests: [
          ...this.state.guests,
          {
            name: name,
            isConfirmed: false
          }
        ],
        value: ''
      });
    }
  };

  handleInputChange = (e) => {
    this.setState({ value: e.target.value });
  };

  toggleHideUnconfirmed = () => {
    this.setState({ hideUnconfirmed: !this.state.hideUnconfirmed });
  };

  toggleConfirmation = (index) => {
    this.setState({
      guests: this.state.guests.map((guest, i) => {
        if (i === index) {
          return { ...guest, isConfirmed: !guest.isConfirmed };
        }
        return guest;
      })
    });
  };

  removeGuest = (index) => {
    this.setState({
      guests: this.state.guests.filter((guest, i) => i !== index)
    });
  };

  updateGuestName = (index, newName) => {
    this.setState({
      guests: this.state.guests.map((guest, i) => {
        if (i === index) {
          return { ...guest, name: newName };
        }
        return guest;
      })
    });
  };

  startEditing = (index) => {
    this.setState({ editingIndex: index });
  };

  stopEditing = () => {
    this.setState({ editingIndex: null });
  };

  handleNameChange = (index, newName) => {
    this.updateGuestName(index, newName);
  };

  render() {
    return (
      <div className="App">
        <header>
          <h1>Volutrack</h1>
          <p>Rosamond Elementary</p>
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.value} onChange={this.handleInputChange} placeholder="Invite Someone" />
            <button type="submit" name="submit" value="submit">Submit</button>
          </form>
        </header>
        <div className="main">
          <div>
            <h2>Volunteers/Visitors</h2>
            <label>
              <input type="checkbox" checked={this.state.hideUnconfirmed} onChange={this.toggleHideUnconfirmed} /> Hide those who haven't responded
            </label>
          </div>
          <table className="counter">
            <tbody>
              <tr>
                <td>Attending:</td>
                <td>{this.getAttendingGuests()}</td>
              </tr>
              <tr>
                <td>Unconfirmed:</td>
                <td>{this.getUnconfirmedGuests()}</td>
              </tr>
              <tr>
                <td>Total:</td>
                <td>{this.getTotalInvited()}</td>
              </tr>
            </tbody>
          </table>
          <GuestList
            guests={this.state.guests}
            hideUnconfirmed={this.state.hideUnconfirmed}
            editingIndex={this.state.editingIndex}
            onToggleConfirmation={this.toggleConfirmation}
            onStartEditing={this.startEditing}
            onStopEditing={this.stopEditing}
            onNameChange={this.handleNameChange}
            onRemoveGuest={this.removeGuest}
          />
        </div>
      </div>
    );
  }
}

export default App;
