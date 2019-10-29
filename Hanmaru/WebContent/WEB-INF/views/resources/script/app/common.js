function validateEmail(email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}

function formatNumber(value) {
	return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}