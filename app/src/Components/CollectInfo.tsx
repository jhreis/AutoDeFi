import React from "react"

export default function CollectInfoComponent() {
  return (
    <div className="segment">
      <h3>Coinbase API Information</h3>
      <label>
        <input type="password" placeholder="Passphrase" />
      </label>
      <label>
        <input type="password" placeholder="Secret" />
      </label>
      <label>
        <input type="password" placeholder="Key" />
      </label>

      <h3>Recurring Schedule</h3>
      <label>
        <input type="number" placeholder="Amount in Dollars" />
      </label>
      <label>
        <input type="number" placeholder="Frequency in Days" />
      </label>
      <button className="green" type="button" onClick={this.props.clickHandler}>
        <i className="icon ion-md-lock"></i>Submit
      </button>
    </div>
  )
}
