export default store => next => action => {
	console.log(store.getState(), action);
	return next(action);
}