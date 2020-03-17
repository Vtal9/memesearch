import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'


class Navbar extends Component{
	render(){
		return(<nav className="nav-wrapper brown darken-1">
			<div className="container">
				<Link to='/' className="brand-logo">Пивнуха №3</Link>
				<ul className="right">
					<li><Link to="/shoppingcart">Корзина</Link></li>
					<li><h6>счет:{this.props.balance}</h6></li>
				</ul>
			</div>
		</nav>)
	}
}

const mapStateToProps = (state) => ({
	balance: state.balance
})
export default connect(mapStateToProps)(Navbar);

