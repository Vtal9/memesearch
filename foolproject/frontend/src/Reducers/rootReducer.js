
const initState = {
	things: []
}

 export default function(state = initState, action){
	if(action.type === 'DELETE_THING'){
		let newThings = state.things.filter(thing => {
			return thing.id != action.id
		});
		state.totalPrice -= state.things.find(thing => thing.id === action.id).price
		return{
			...state,
			things: newThings
		}
	}
	if(action.type === 'ADD_THING'){
		if(action.title != null){
			let newThing = {
			title: action.title,
			price: action.price,
			id: Math.random(),
			}
			state.totalPrice += action.price
			let newThings = [...state.things, newThing]
			return{
				...state,
				things: newThings
			}
		}
	}
	if(action.type === 'PAY'){
		if(state.totalPrice !== 0){
			if(state.balance >= state.totalPrice){
				state.balance -= state.totalPrice
				state.totalPrice = 0
				return{
					...state,
					things: []
				}
			}
		}
	}
	if(action.type === 'GET_PRODUCT'){
        return {
            ...state,
            pivandrii: action.payload
        };
	}
	return state;
}
