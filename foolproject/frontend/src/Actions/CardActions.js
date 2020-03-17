export const deleteThing = (id) => dispatch => {
	dispatch({
		type: 'DELETE_THING',
		id
	})
}


export const addThing = (thing) => dispatch => {
	dispatch({
		type: 'ADD_THING',
		title: thing.title,
		price: thing.price,
	})
}

export const pay = () => dispatch =>{
	dispatch({
		type: 'PAY',
	})

}