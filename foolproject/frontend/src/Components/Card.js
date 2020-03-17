import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addThing } from '../Actions/CardActions'
import { getProduct } from '../Actions/loadProduct'
import sample from './sample.jpg'

class Cards extends Component{
	componentDidMount(){
		this.props.getProduct();
	}

	render(){
		return <div className='cards'>
			{this.props.pivandrii.map(pivandr => (
				<div key={pivandr.id} className="card" style={{width: '18rem'}}>
				  <img src={pivandr.image} className="card-img-top" alt="" />
				  <div className="card-body">
				    <h5 className="card-title">{pivandr.title}</h5>
				    <p className="card-text">{pivandr.price}</p>
				    <a className="btn btn-primary" onClick={this.props.addThing.bind(this, pivandr)}>Добавить в корзину</a>
				  </div>
				</div>
		)
		)}
			</div>
	}

}

const mapStateToProps = (state) => ({
	pivandrii: state.pivandrii
})


export default connect(mapStateToProps,{ addThing, getProduct })(Cards)