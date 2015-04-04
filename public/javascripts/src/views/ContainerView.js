import Dropzone from 'dropzone';
import SignInView from './SignInView';
import AlbumsView from './AlbumsView';
import AlbumView from './AlbumView';
import HomepageView from './HomepageView';

var ContainerView = Backbone.View.extend({
	events: {
		'click .internal-link' : 'handleInternalLink',
		'mousedown .autohighlight': 'highlightShortLink',
		'click .autohighlight': 'highlightShortLink',
		'keypress .no-edit': 'preventEditing',
		'keyup .no-edit': 'preventEditing',
		'keydown .no-edit': 'preventEditing'
	},
	initialize: function () {
		console.log('Starting model:', this.model);
		console.log('Starting collection:', this.collection);

		this.viewState = new Backbone.Model({
			firstLoad: true
		});

		this.albumListView = new AlbumsView({
			el: this.$('#page-container')[0],
			collection: this.collection
		});

		this.albumView = new AlbumView({
			el: this.$('#page-container')[0],
			model: this.model
		});

		this.homepageView = new HomepageView({
			el: this.$('#page-container')[0]
		});
	},
	handleInternalLink: function (e) {
		var link = $(e.currentTarget);
		e.preventDefault();
		Backbone.history.navigate(link.attr('href'), { trigger : true });
	},
	shouldFetch: function () {
		return !this.viewState.get('firstLoad');
	},
	showAlbumListView: function () {
		this.loadView(() => {
			this.albumListView.delegateEvents();
		}, () => {
			this.collection.albums.fetch();
		});
	},
	showAlbumView: function (shortName) {
		this.loadView(() => {
			this.albumView.delegateEvents();
		}, () => {
			this.model.album.set('shortName', shortName);
			this.model.album.fetch();
		});
	},
	showHomepageView: function () {
		this.loadView(undefined, () => {
			this.homepageView.render();
		}, () => {
			this.homepageView.delegateEvents();
		});
	},
	/* DOM MANIPULATION */
	highlightShortLink: function (e) {
		e.preventDefault();
		let target = $(e.currentTarget);
		target.select();
	},
	preventEditing: function (e) {
		e.preventDefault();
	},
	/**
	 * Execute a different callback depending on whether this is the first load
	 * of the page or not. If it is, it'll do the first thing then set the
	 * firstLoad state to false. Otherwise it'll do the other function.
	 * @param  {[type]} firstCallback     [description]
	 * @param  {[type]} otherwiseCallback [description]
	 * @return {[type]}                   [description]
	 */
	loadView: function (firstCallback = () => {}, otherwiseCallback = () => {}, alwaysAfterCallback = () => {}) {
		let isFirstLoad = this.viewState.get('firstLoad');
		if (isFirstLoad) {
			firstCallback();
		} else {
			otherwiseCallback();
		}
		alwaysAfterCallback();
		this.viewState.set('firstLoad', false);
	}
});

export default ContainerView;
