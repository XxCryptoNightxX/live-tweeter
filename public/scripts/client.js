/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const tweetData = [
	{
		"user": {
			"name": "Newton",
			"avatars": "https://i.imgur.com/73hZDYK.png"
			,
			"handle": "@SirIsaac"
		},
		"content": {
			"text": "If I have seen further it is by standing on the shoulders of giants"
		},
		"created_at": 1461116232227
	},
	{
		"user": {
			"name": "Descartes",
			"avatars": "https://i.imgur.com/nlhLi3I.png",
			"handle": "@rd" },
		"content": {
			"text": "Je pense , donc je suis"
		},
		"created_at": 1461113959088
	}
];
$(document)
	.ready(function () {
		// handle  form submit
		$(".new-tweet form")
			.on("submit", submitTweet);
		loadTweets();
		// renderTweets(tweetData);
	});
const submitTweet = function (event) {
	event.preventDefault();
	var $form = $(this);
	var $input = $form.find('textarea');
	var formData = $form.serialize();
	//submit ajax request
	$.ajax({
			url: "/tweets"
			, type: "post"
			, data: formData
		})
		.done(function (data) {
			loadTweets();
		});
	return true;
};
function loadTweets() {
	// not expecting use of promises or for them to understand them at least.
	$.ajax('/tweets', {
			method: 'GET'
			, dataType: "json"
		})
		.then(function (result) {
			renderTweets(result);
		});
}
const renderTweets = function (tweets) {
	var tweetsContainer = $('#tweets-container');
	// Empty the container first
	tweetsContainer.html('');
	tweets.forEach((tweet) => {
		const tweetElement = createTweetElement(tweet);
		tweetsContainer.prepend(tweetElement);
	});
};
const createTweetElement = function (tweetData) {
	const $tweet = $("<article>")
		.addClass("tweet");
	const html = `<header class="tweet--header">
      <img class="tweet--avatar" src="${tweetData.user.avatars}">
      <h2 class="tweet--name">${tweetData.user.name}</h2>
      <small class="tweet--handle">${tweetData.user.handle}</small>
    </header>
    <div class="tweet--body">
      <p>${tweetData.content.text}</p>
    </div>
    <footer class="tweet--footer">
      <small class="footer--age">${'10 days ago'}<small>
      <span class="footer--actions">
        <a href="#"><i class="fa fa-flag"></i></a>
        <a href="#"><i class="fa fa-retweet"></i></a>
        <a href="#"><i class="fa fa-heart"></i></a>'
      </span>
    </footer>`;
	const tweetElement = $tweet.append(html);
	return tweetElement;
};
