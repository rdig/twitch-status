const Hooks = {
	content: $('.content'),
	preloader: $('#preloader'),
	error: $('#ajax-error')
}
const Proto = {
	generateHeading: (title) => {
		return (
			'<h3>' + title + '</h3>'
		);
	},
	generateStreamer: (link, name, image, status) => {
		return (
			'<div class="channel"><a href="' + link + '">' +
			'<span class="image" style="background-url(\"' + image + '\")"></span>' +
			'<p class="title">' + name + '</p>' +
			'<p class="status">' + status + '</p>' +
			'</a></div>'
		);
	}
};
