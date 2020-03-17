import React, { Component } from 'react'
import { connect } from 'react-redux'
import { deleteThing, pay } from '../Actions/CardActions'

class ShoppingCard extends Component{
	render(){
		console.log(this.props.things.length)
		const things_in_cart = this.props.things.length !== 0 ? this.props.things.map(thing => (
				<div key={thing.id} className="list-group">

				 	<a style={{cursor: 'pointer'}} className="list-group-item list-group-item-action" onClick={this.props.deleteThing.bind(this, thing.id)}>
					 	<div>{thing.title}</div>
					 	<div className="right">{thing.price}</div>
				 	</a>

				</div>
			)) : (
				<div className="center">Купи пива, в пиве твоя сила и мудрость!</div>
			)
		return(
			<div>
				<div className="container">
				        {things_in_cart}
				</div>
				<div className='container'>
					<h1>Итого: {this.props.things.length != 0 ? this.props.things.map(thing =>(thing.price)).reduce((a,b)=>a+b,0) : 0}</h1>
					<button type="button" className="btn btn-warning" onClick={this.props.pay.bind(this)}>Купить</button>
				</div>
			</div>
		)
	}

	
}

const mapStateToProps = (state) => ({
	things: state.things
})


export default connect(mapStateToProps, { deleteThing, pay })(ShoppingCard)