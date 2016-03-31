// Functions go here.
var SlideShow = SlideShow || {};
SlideShow = {
	data           : {
		currentImageIndex : 0,
		slideShowInterval : null
	},
	init           : function(){
		this.bindSearch();
		this.bindStop();
	},
	bindSearch     : function(){
		var that = this;
		$('#searchForm').on('submit',function(e){
			e.preventDefault();

			// Stop a slideshow that may be in progress.
			that.stopSlideShow();

			var inputs = $(this).find('input');
			var values = {};

			$.each(inputs, function(index, value){
				values[this.name] = this.value;
			});
			that.searchReddit(values);
		});
	},
	bindStop       : function(){
		var that = this;
		$('#stopSlideshow').on('click', function(e){
			e.preventDefault();
			that.stopSlideShow();
		});
	},
	searchReddit   : function(searchTerms){
		var that = this;
		$.ajax({
			method  : 'GET',
			url     : 'https://www.reddit.com/r/pics/search.json',
			data    : {
				'q'           : searchTerms.searchTerm,
				'restrict_sr' : true,
				'limit'       : 100,
				'type'        : 'link'
			},
			success : function(response, textStatus, sink){
				that.getImages(response.data.children);
			}
		});
	},
	getImages      : function(posts){
		var imageLinks = posts.map(function(post){
        	return post.data.url;
      	}).filter(function(url){
        	return url.search(/(.jpg|.png|.gif|.jpeg)$/) !== -1;
      	});
      	this.setImageLinks(imageLinks);
	},
	setImageLinks  : function(imageLinks){
		localStorage.setItem('imageLinks', JSON.stringify(imageLinks));
		this.startSlideShow();
	},
	showImage      : function(){
		var slideShowElem = $('#slideShow'),
			currentImageIndex = this.data.currentImageIndex,
			imageLinks = JSON.parse(localStorage.getItem('imageLinks')),
			imageLink = imageLinks[currentImageIndex];

		var imageElem = $('<img>', {
			'src' : imageLink,
			'css' : {
				'width'  : '50%',
			}
		});

		slideShowElem.html(imageElem);
    	// Increment the current image index.
    	this.data.currentImageIndex = currentImageIndex + 1;
	},
	startSlideShow : function(){
		var that = this;
		this.data.slideShowInterval = setInterval(function(){ that.showImage() }, 2000);
	},
	stopSlideShow  : function(){
		var that = this;
		clearInterval(that.data.slideShowInterval);
		$('#slideShow').empty();
	}
}