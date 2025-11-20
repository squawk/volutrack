import React, { Component } from 'react';

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
    hideUnconfirmed: false
  };

  getTotalInvited = () => this.state.guests.length;
  // getAttendingGuests = () =>
  // getUnconfirmedGuests = () =>

  handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic will be implemented later
  };

  handleInputChange = (e) => {
    this.setState({ value: e.target.value });
  };

  toggleHideUnconfirmed = () => {
    this.setState({ hideUnconfirmed: !this.state.hideUnconfirmed });
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
                <td>2</td>
              </tr>
              <tr>
                <td>Unconfirmed:</td>
                <td>1</td>
              </tr>
              <tr>
                <td>Total:</td>
                <td>3</td>
              </tr>
            </tbody>
          </table>
          <ul>
            <li className="pending"><span>Safia</span></li>
            <li className="responded"><span>Iver</span>
              <label>
                <input type="checkbox" checked onChange={() => {}} /> Confirmed
              </label>
              <button>edit</button>
              <button>remove</button>
            </li>
            <li className="responded"><span>Corrina</span>
              <label>
                <input type="checkbox" checked onChange={() => {}} /> Confirmed
              </label>
              <button>edit</button>
              <button>remove</button>
            </li>
            <li>
              <span>Joel</span>
              <label>
                <input type="checkbox" onChange={() => {}} /> Confirmed
              </label>
              <button>edit</button>
              <button>remove</button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
