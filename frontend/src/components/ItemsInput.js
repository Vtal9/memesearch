import React from 'react'
import PropTypes from 'prop-types'
import close from '../img/close.png'


Array.prototype.isLast = function(index) {
  return this.length - 1 == index
}


export default class ItemsInput extends React.Component {
  constructor(props) {
    super()
    const items = props.items || ['']
    this.state = {
      inputs: [...items, '']
    }
  }

  render() {
    const { inputs } = this.state
    const [ primary, secondary ] = this.props.placeholders
    return (
      <div className='items-input'>
        {inputs.map((value, index) =>
          <div className='item' key={index}>
            <input type="text" value={value}
              placeholder={inputs.isLast(index) ? secondary : primary}
              autoComplete='off'
              onChange={e => {
                inputs[index] = e.target.value
                this.setState({ inputs })
              }}
              onFocus={() => {
                if (inputs.isLast(index)) {
                  inputs.push('')
                  this.setState({ inputs })
                }
              }}
            />
            {inputs.length > 2 && !inputs.isLast(index) &&
              <div onClick={() => {
                inputs.splice(index, 1)
                this.setState({ inputs })
              }} className='close'><img src={close} /></div>
            }
          </div>
        )}
      </div>
    )
  }
}

ItemsInput.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  placeholders: PropTypes.arrayOf(PropTypes.string),
  test: PropTypes.number
}