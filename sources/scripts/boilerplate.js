const Api = (channel, type) => {
	return 'https://api.twitch.tv/kraken/' + type + '/' + channel + '?callback=?';
};
const Hooks = {
	content: $('.content'),
	preloader: $('#preloader'),
	error: $('#ajax-error').children('.error'),
	online: $('#online'),
	offline: $('#offline'),
	closed: $('#closed'),
	channels: $('#channels')
}
const Images = {
	channelClosed: '../media/images/rg-fcc-twitch-notfound_v1.svg'
}
const HardcodedChannels = [
	'totalbiscuit',
	'freecodecamp',
	'comster404',
	'eloise_ailv',
	'PticaTV',
	'TrumpSC',
	'itsHafu',
	'Tinkerleo',
	'AngryJoeShow',
	'Dendi',
	'PlayHearthstone'
];
const Proto = {
	generateStreamer: (name, displayName, image, status) => {
		return (
			'<div class="channel"><a href="http://www.twitch.tv/' + name + '">' +
			'<span class="image" style="background-image: url(\'' + image + '\')"></span>' +
			'<p class="title">' + displayName + '</p>' +
			'<p class="status">' + status + '</p>' +
			'</a></div>'
		);
	}
};
const PromiseGenerator = (channel, type) => {
	return new Promise((resolve, reject) => {
		$.getJSON(Api(channel, type)).done((data) => {
			data.channel = channel
			resolve(data);
		}).fail((error) => {
			reject(error);
		});
	});
};

(function() {

	let promiseArr = [];

	HardcodedChannels.map((channel) => {
		promiseArr.push(PromiseGenerator(channel, 'streams'));
	});

	Promise.all(promiseArr).then((streamsArr, channel) => {
		let onlineArr = streamsArr.filter((streamObj) => {
			return streamObj.stream;
		});
		let offlineArr = streamsArr.filter((streamObj) => {
			if (streamObj.stream === null) {
				return true;
			}
			return false;
		});
		let closedArr = streamsArr.filter((streamObj) => {
			if (streamObj.stream === undefined) {
				return true;
			}
			return false;
		});
		onlineArr.map((s) => {
			Hooks.online.append(Proto.generateStreamer(
				s.stream.channel.name,
				s.stream.channel.display_name,
				s.stream.preview.large,
				'Playing ' + s.stream.game
			));
			Hooks.online.show();
		});
		offlineArr.map((s) => {
			$.getJSON(Api(s.channel, 'channels')).done((data) => {
				Hooks.offline.append(Proto.generateStreamer(
					data.name,
					data.display_name,
					(data.video_banner || data.logo),
					'Channel offline'
				));
			});
			Hooks.offline.show();
		});
		closedArr.map((s) => {
			Hooks.closed.append(Proto.generateStreamer(
				s.channel,
				s.channel,
				Images.channelClosed,
				'Channel was closed'
			));
			Hooks.closed.show();
		});
		Hooks.content.removeClass('loading');
		Hooks.preloader.hide();
		Hooks.channels.show();

	}).catch(function() {

		Hooks.content.removeClass('loading');
		Hooks.preloader.hide();
		Hooks.error.fadeIn();

	});

}())
